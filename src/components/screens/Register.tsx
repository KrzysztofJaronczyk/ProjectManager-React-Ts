export default function Register() {
    function RegisterUser(){
        
    }
    return (
      <>
      <form action="register">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Register</button>
      </form>
      </>
    );
  }
  