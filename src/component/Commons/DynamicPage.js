import React from 'react';
import { Helmet } from 'react-helmet-async';

const DynamicPage = ({ title, description }) => {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
    </div>
  );
};

export default DynamicPage;
