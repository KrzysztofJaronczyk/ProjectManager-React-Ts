interface User {
    id: string;
    login: string;
    password: string;
    email: string;
    displayName: string;
    role: 'admin' | 'developer' | 'devops';
  }
  
  export default User;
  