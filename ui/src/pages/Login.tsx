import React from 'react';

export default function Login() {
  const callLogin = () => {
    window.location.replace(process.env.REACT_APP_API_URL + '/auth/42/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <button
        type="button"
        className="btn btn-outline-dark"
        style={{ margin: '0 auto' }}
        onClick={callLogin}
      >
        Login
      </button>
    </div>
  );
}
