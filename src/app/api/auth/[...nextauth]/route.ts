import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/app/api/auth/[...nextauth]/(axios)/axios";


const handlers = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }; // changed id to string
        if (credentials?.username === "test@gmail.com" && credentials?.password === "hello123") {
          return user;
        } else {
          return null;
        }
      },
    }),

    GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  pages:{
    signIn:"/login",
    signOut:"/login"
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      let data
      try {
        data =await api.post('/register',{email:user.email,name:user.name,password:user.image})
        
      } 
      catch (error) {
        

      }
      
      
      return true
    },}
});

export { handlers as GET, handlers as POST };
