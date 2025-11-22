import React from 'react';

const ContactMap = () => {
  return (
    <div className="h-[400px] w-full bg-gray-100">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0927139411775!2d-122.39663372356964!3d37.78779971472667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807d2a70dd79%3A0x736a2f4e6c5b6e23!2sSan%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1709840444185!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default ContactMap;