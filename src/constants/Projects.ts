type Project = {
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  codeUrl: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Duo Dev",
    description: " A pair-programmer finder.",
    image:
      "https://images.unsplash.com/photo-1714745455353-f47a2e2b5647?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    liveUrl: "https://duo-dev-production.up.railway.app/",
    codeUrl: "https://github.com/vinaybadgujar102/duo-dev",
  },
  {
    title: "Netflix Clone",
    description: "Netflix experience recreated with React.",
    image:
      "https://images.unsplash.com/photo-1714745455353-f47a2e2b5647?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    codeUrl: "https://github.com/vinaybadgujar102/netflix-clone",
    liveUrl: "https://netflix-clone-nine-flame.vercel.app/",
  },
  {
    title: "Blogify",
    description: "A simple blogging app with sleek minimal design.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    codeUrl: "https://github.com/vinaybadgujar102/blogging-app",
  },
];
