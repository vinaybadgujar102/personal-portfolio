export type Social = {
  github: string;
  twitter: string;
  instagram: string;
  linkedin: string;
};

type PERSONALDETAILS = {
  name: string;
  photo: string;
  designation: string;
  address: string;
  email: string;
  socials: Social;
};

export const PERSONALDETAILS: PERSONALDETAILS = {
  name: "Vinay Badgujar",
  photo: "https://pbs.twimg.com/profile_images/1457288004184076289/vCIxXf9Q_400x400.jpg",
  designation: "Full Stack Developer",
  address: "Jalgaon, MH, India",
  email: "vinaybadgujar8@gmail.com",
  socials: {
    github: "https://github.com/vinaybadgujar102",
    twitter: "https://twitter.com/vinaybadgujar8",
    instagram: "https://www.instagram.com/the_badgujar_vinay",
    linkedin: "https://www.linkedin.com/in/badgujarvinay/",
  },
};
