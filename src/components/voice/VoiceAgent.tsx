import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from '../../constants';
import { createPcmBlob, base64ToUint8Array, decodeAudioData } from '../../utils/audioUtils';
import { Mic, Square } from 'lucide-react';

const VoiceAgent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for Audio Logic
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  // Refs for Audio Playback
  const nextStartTimeRef = useRef<number>(0);
  const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Refs for Visualization
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  const cleanupAudio = useCallback(() => {
    clearSilenceTimeout();

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    sourceNodesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourceNodesRef.current.clear();

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    inputAnalyserRef.current = null;
    outputAnalyserRef.current = null;

    setIsConnected(false);
    setIsAgentSpeaking(false);
    sessionPromiseRef.current = null;
  }, [clearSilenceTimeout]);

  const connectToLiveAPI = async () => {
    setError(null);

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError("API Key Missing");
      return;
    }

    const client = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

      // 1. Initialize Audio Contexts
      // Input: 16kHz for Gemini compatibility
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      // Output: 24kHz for Gemini compatibility
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });

      // 2. Setup Analysers
      const inputAnalyser = inputAudioContextRef.current.createAnalyser();
      inputAnalyser.fftSize = 32;
      inputAnalyser.smoothingTimeConstant = 0.8;
      inputAnalyserRef.current = inputAnalyser;

      const outputAnalyser = outputAudioContextRef.current.createAnalyser();
      outputAnalyser.fftSize = 32;
      outputAnalyser.smoothingTimeConstant = 0.8;
      outputAnalyserRef.current = outputAnalyser;

      // 3. Setup Output Chain
      const outputGain = outputAudioContextRef.current.createGain();
      outputGain.connect(outputAnalyser);
      outputAnalyser.connect(outputAudioContextRef.current.destination);

      // 4. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 5. Connect to Gemini
      const sessionPromise = client.live.connect({
        model: GEMINI_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Laomedeia' } }
          }
        },
        callbacks: {
          onopen: async () => {
            console.log("Session opened");
            setIsConnected(true);

            if (!inputAudioContextRef.current || !stream) return;

            // Resume contexts just in case they are suspended
            await inputAudioContextRef.current.resume();
            await outputAudioContextRef.current?.resume();

            // Input Chain
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);

              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => {
                    session.sendRealtimeInput({ media: pcmBlob });
                }).catch(err => console.error("Session send error", err));
              }
            };

            source.connect(inputAnalyser);
            inputAnalyser.connect(processor);

            // IMPORTANT: Connect processor to a mute node then to destination.
            // This forces the browser to process the audio but prevents feedback.
            const muteNode = inputAudioContextRef.current.createGain();
            muteNode.gain.value = 0;
            processor.connect(muteNode);
            muteNode.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.interrupted) {
              console.log("Interrupted");
              sourceNodesRef.current.forEach(node => {
                try { node.stop(); } catch(e) {}
              });
              sourceNodesRef.current.clear();
              nextStartTimeRef.current = outputAudioContextRef.current?.currentTime || 0;
              setIsAgentSpeaking(false);
              return;
            }

            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              try {
                const uint8Array = base64ToUint8Array(base64Audio);
                const audioBuffer = await decodeAudioData(uint8Array, ctx, 24000, 1);

                const now = ctx.currentTime;
                // Ensure smooth playback scheduling
                if (nextStartTimeRef.current < now) {
                  nextStartTimeRef.current = now;
                }
                // Add a tiny buffer if starting from silence to prevent glitches
                if (nextStartTimeRef.current < now + 0.01) {
                    nextStartTimeRef.current = now + 0.05;
                }

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputGain);

                source.onended = () => {
                  sourceNodesRef.current.delete(source);
                  if (sourceNodesRef.current.size === 0) setIsAgentSpeaking(false);
                };

                source.start(nextStartTimeRef.current);
                sourceNodesRef.current.add(source);
                setIsAgentSpeaking(true);
                nextStartTimeRef.current += audioBuffer.duration;
              } catch (err) {
                console.error("Error decoding audio", err);
              }
            }
          },
          onclose: () => {
            console.log("Session closed");
            cleanupAudio();
          },
          onerror: (err) => {
            console.error("Session error", err);
            setError("Connection Error");
            cleanupAudio();
          }
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err: any) {
      console.error("Setup error", err);
      setError("Mic Error");
      cleanupAudio();
    }
  };

  const handleToggle = () => {
    if (isConnected) cleanupAudio();
    else connectToLiveAPI();
  };

  // Auto-close after agent finishes speaking
  useEffect(() => {
    if (!isConnected) return;

    if (!isAgentSpeaking) {
      // Agent finished speaking, start timeout for auto-close
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        console.log("Conversation timeout - auto-closing");
        if (sessionPromiseRef.current) {
          sessionPromiseRef.current.then(session => {
            session.close?.();
          }).catch(err => console.error("Error closing session", err));
        }
        cleanupAudio();
      }, 30000); // 30 seconds of silence
    } else {
      // Agent is speaking, clear the timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }

    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    };
  }, [isAgentSpeaking, isConnected, cleanupAudio]);

  // Visualizer Loop
  useEffect(() => {
    if (!isConnected) return;
    let animationFrameId: number;

    const updateVisuals = () => {
      const inputAnalyser = inputAnalyserRef.current;
      const outputAnalyser = outputAnalyserRef.current;
      const button = buttonRef.current;
      const glow = glowRef.current;

      if (button && glow && inputAnalyser && outputAnalyser) {
        // Determine active analyser (Agent takes priority for visual focus)
        const analyser = isAgentSpeaking ? outputAnalyser : inputAnalyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        // Calculate volume (RMS-ish)
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / dataArray.length;
        // Normalize to 0-1 range (approximate)
        const volume = Math.min(avg / 100, 1);

        // Dynamic scaling based on volume
        const scale = 1 + (volume * 0.2); // subtle scale
        const glowOpacity = Math.max(0.1, volume * 1.2); // ensure some visibility
        const glowSize = 10 + (volume * 40); // px size of shadow

        button.style.transform = `scale(${scale})`;

        if (isAgentSpeaking) {
           // Agent: Royal Blue Pulse
           glow.style.boxShadow = `0 0 ${glowSize}px ${glowSize/2}px rgba(29, 78, 216, ${glowOpacity})`;
           glow.style.backgroundColor = `rgba(29, 78, 216, 0.1)`;
           button.style.borderColor = 'rgba(29, 78, 216, 1)';
        } else {
           // User: Emerald/Green Pulse (distinct from Blue)
           glow.style.boxShadow = `0 0 ${glowSize}px ${glowSize/2}px rgba(16, 185, 129, ${glowOpacity})`;
           glow.style.backgroundColor = `rgba(16, 185, 129, 0.1)`;
           button.style.borderColor = 'rgba(16, 185, 129, 1)';
        }
      }
      animationFrameId = requestAnimationFrame(updateVisuals);
    };

    updateVisuals();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isConnected, isAgentSpeaking]);

  return (
    <div className="flex flex-col items-center justify-center font-sans">
      {/* Glow Container */}
      <div className="relative flex items-center justify-center">
        <div
          ref={glowRef}
          className={`absolute w-full h-full rounded-full transition-all duration-100 pointer-events-none
            ${isConnected ? 'opacity-100' : 'opacity-0'}
          `}
        />

        <button
          ref={buttonRef}
          onClick={handleToggle}
          className={`
            relative z-10 flex items-center justify-center w-48 h-48 rounded-full border-4 transition-all duration-300 focus:outline-none shadow-2xl
            ${isConnected
              ? 'bg-white border-blue-700 text-blue-700'
              : 'bg-blue-700 border-blue-700 hover:bg-blue-800 text-white hover:scale-105'}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
        >
          {isConnected ? (
             <Square className="w-16 h-16 fill-current animate-pulse" />
          ) : (
             <Mic className="w-20 h-20" />
          )}
        </button>
      </div>

      {/* Minimal Status Text */}
      <div className="mt-6 text-center">
        {error ? (
           <p className="text-red-500 font-medium animate-pulse">{error}</p>
        ) : isConnected ? (
           <p className="text-blue-900 font-semibold tracking-wide text-sm uppercase">
             {isAgentSpeaking ? 'Astra Speaking' : 'Listening...'}
           </p>
        ) : (
           <p className="text-gray-500 font-medium text-sm">
             Click to Speak with Astra
           </p>
        )}
      </div>
    </div>
  );
};

export default VoiceAgent;
