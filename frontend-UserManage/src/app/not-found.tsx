// pages/404.tsx
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

const Custom404: NextPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '40vh',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: '3rem',
      }}>
        404 - Page Not Found
      </h1>
      <p style={{
        fontSize: '1.5rem',
        margin: '1rem 0',
      }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/home">
        <span style={{
          fontSize: '1.2rem',
          color: '#0070f3',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}>
          Go back to Home
        </span>
      </Link>
    </div>
  );
};

export default Custom404;
