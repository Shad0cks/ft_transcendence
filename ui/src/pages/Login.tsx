import React from 'react';

export default function Login() {
  // const callLogin = () =>
  //   {
  //     //window.location.replace("http://localhost:8080/auth/42/login")
  //     window.location.replace("http://localhost:8080/callback?isLog=true&username=hugo&icon=http://image.jpg")
  //   }
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
      <a
        type="button"
        className="btn btn-outline-success"
        style={{ margin: '0 auto' }}
        href={
          'http://localhost:3000/callback?isLog=true&username=hugo&icon=http://image.jpg'
        }
      >
        Login
      </a>
    </div>
  );
}
