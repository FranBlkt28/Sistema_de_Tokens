import * as React from 'react';
import '../styles/styles.css';

export default function Auth() {
    return (
        <React.Fragment>
            <div className="card">
                
                <input type="checkbox" id="toggle" className="toggle" />
                <div className="card-bg"></div>
                
                <div className="hero register">
                    <h2>Welcome back</h2>
                    <p>Login to review your...</p>
                    <label htmlFor="toggle">LOGIN</label>
                </div>

                <div className="form register">
                    <h2>Register</h2>
                    <form>
                        <label>Name</label>
                        <input type="text" placeholder="Nazareno Beavuais" />
                        <label>Email</label>
                        <input type="email" placeholder="nazarenobeauvais@gmail.com" />
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" />
                        <button type="submit">SIGN UP</button>
                    </form>
                </div>

                <div className="hero login">
                    <h2>Hello there</h2>
                    <p>Begin yout journey...</p>
                    <label htmlFor="toggle">SIGN UP</label>
                </div>

                <div className="form login">
                    <h2>Login</h2>
                    <form>
                        <label>Email</label>
                        <input type="email" placeholder="hello@example.com" />
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" />
                        <div className="remember-forgot">
                            <div className="remember">
                            <span></span>
                            <a className="forgot">Remember me</a>
                            </div>
                            <a className="forgot">Forgot password?</a>
                        </div>
                        <button type="submit">LOGIN</button>
                    </form>
                </div>

            </div>
        </React.Fragment>
    )
}