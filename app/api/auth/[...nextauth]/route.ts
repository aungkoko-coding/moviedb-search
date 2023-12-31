import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

// console.log({
//   google_id: process.env.GOOGLE_ID,
//   google_secret: process.env.GOOGLE_CLIENT_SECRET,
// });

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  theme: {
    logo: "/icon.png",
  },
  callbacks: {
    async session({ session, token }) {
      const user: any = session.user;
      if (user) {
        const sessionUser = await User.findOne({ email: user.email });
        user.id = sessionUser._id.toString();
      }

      return session;
    },
    async signIn({ profile }: any) {
      try {
        await connectToDB();
        if (profile) {
          // check if a user already exists
          const userExists = await User.findOne({ email: profile.email });
          // if not, create a new user
          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name?.split(" ").join("").toLowerCase(),
              image: profile.picture,
            });
          }
        }

        return true;
      } catch (err) {
        console.log({ err });
        return false;
      }
    },
  },
});

// 1:48:44
export { handler as GET, handler as POST };
