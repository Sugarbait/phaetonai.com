import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Check if email already exists in local database
    const { data: existingSubscription } = await supabaseClient
      .from('newsletter_subscriptions')
      .select('id')
      .eq('email', email)
      .single();

    if (existingSubscription) {
      return new Response(
        JSON.stringify({ error: 'Email already subscribed' }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Get Brevo API key
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    
    if (!brevoApiKey) {
      throw new Error('Missing Brevo API key. Please set BREVO_API_KEY environment variable.');
    }

    // Add contact to Brevo first
    let brevoContactId = null;
    let brevoSuccess = false;
    
    console.log(`Attempting to add email to Brevo: ${email}`);
    console.log(`Brevo API Key present: ${brevoApiKey ? 'Yes' : 'No'}`);
    console.log(`API Key length: ${brevoApiKey?.length || 0}`);

    try {
      const brevoPayload = {
        email: email,
        attributes: {
          SUBSCRIPTION_DATE: new Date().toISOString(),
          SOURCE: 'Website Newsletter Popup'
        },
        listIds: [], // You can add specific list IDs here if needed
        updateEnabled: true, // Update if contact already exists
      };

      console.log('Brevo request payload:', JSON.stringify(brevoPayload, null, 2));

      const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify(brevoPayload),
      });

      console.log(`Brevo API response status: ${brevoResponse.status}`);
      console.log(`Brevo API response headers:`, Object.fromEntries(brevoResponse.headers.entries()));

      const brevoResponseText = await brevoResponse.text();
      console.log(`Brevo API raw response: "${brevoResponseText}"`);
      console.log(`Response text length: ${brevoResponseText.length}`);

      if (brevoResponse.ok) {
        // Status 204 means success with no content - this is expected for contact creation
        if (brevoResponse.status === 204) {
          console.log('Successfully added contact to Brevo (204 No Content)');
          brevoSuccess = true;
          brevoContactId = null; // Brevo doesn't return the ID in 204 responses
        } else {
          // Only try to parse JSON if we have content and it's not a 204
          let brevoResult;
          try {
            if (!brevoResponseText || brevoResponseText.trim() === '') {
              console.log('Contact created successfully but no content returned');
              brevoSuccess = true;
            } else {
              brevoResult = JSON.parse(brevoResponseText);
              if (brevoResult && brevoResult.id) {
                brevoContactId = brevoResult.id;
                console.log('Successfully added contact to Brevo:', brevoResult);
              } else {
                console.log('Contact created successfully but no ID returned');
              }
              brevoSuccess = true;
            }
          } catch {
            console.log('Could not parse response as JSON, but contact creation succeeded');
            brevoSuccess = true;
          }
        }
      } else {
        // Handle error responses
        let brevoResult;
        try {
          if (brevoResponseText && brevoResponseText.trim() !== '') {
            brevoResult = JSON.parse(brevoResponseText);
          }
        } catch (parseError) {
          console.error('Failed to parse Brevo error response as JSON:', parseError);
        }

        console.error('Brevo API Error Response:', brevoResult);
        
        // If contact already exists in Brevo, that's okay
        if (brevoResult && brevoResult.code === 'duplicate_parameter') {
          console.log('Contact already exists in Brevo, proceeding...');
          brevoSuccess = true;
        } else {
          console.error(`Brevo API Error (${brevoResponse.status}):`, brevoResult);
          throw new Error(`Brevo API Error: ${brevoResult?.message || brevoResult?.code || `HTTP ${brevoResponse.status}`}`);
        }
      }
    } catch (brevoError) {
      console.error('Failed to add contact to Brevo:', brevoError);
      console.error('Error details:', {
        name: brevoError.name,
        message: brevoError.message,
        stack: brevoError.stack
      });
      throw new Error(`Failed to subscribe to newsletter: ${brevoError.message}`);
    }

    // Store the email in Supabase database
    const { error: subscriptionError } = await supabaseClient
      .from('newsletter_subscriptions')
      .insert([{ 
        email
      }]);

    if (subscriptionError) {
      console.error('Supabase insert error:', subscriptionError);
      throw new Error('Failed to store subscription');
    }

    console.log(`Successfully subscribed email: ${email}${brevoSuccess ? ' (added to Brevo)' : ''}`);

    return new Response(
      JSON.stringify({ 
        message: 'Successfully subscribed to newsletter',
        email: email,
        brevo_contact_id: brevoContactId
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});