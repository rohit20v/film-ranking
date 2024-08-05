# Film Ranking 🎬

**Film Ranking** is a web application built with Remix, Prisma, SQLite, and PicoCSS, all written in TypeScript. The platform allows users to share their favorite movies online and explore movies added by others. 

## Features ✨

- **User Accounts**: Users can create accounts, log in, and manage their profiles. 🧑‍🤝‍🧑
- **Movie Sharing**: Users can add movies to their profile and share their favorite films with others. 🍿
- **Social Interaction**: Users can search for other users by username, view the movies they have added, and manage their list of friends. 🔍
- **Movie Posters**: Integrated with OMDB API to fetch movie posters. 🎥
- **Custom APIs**: Utilizes custom APIs for various functionalities. ⚙️

## Installation ⚡

To set up the project locally, follow these steps:

1. **Clone the Repository**:
    ```bash
    https://github.com/rohit20v/film-ranking.git
    cd film-ranking
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Setup .env file**:
add ".env" file to the root directory of the project 
   ```env
   DATABASE_URL=file:dev.db
   OMDB_KEY=<your omdb api key for https://www.omdbapi.com/>
   SECRET_KEY=<custom key>
    ```

5. **Setup the Database**:
    ```bash
    npx prisma migrate dev --name init
    ```

6. **Start the Application**:
    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:3000](http://localhost:3000). 🌐

## Usage 🚀

1. **Create an Account**: Register a new account on the platform. 📝
2. **Log In**: Use your credentials to log in. 🔑
3. **Add Movies**: Add your favorite movies and share them with other users. 🎞️
4. **Search and Follow**: Find other users by username and view their movie lists. 🔎
5. **Manage Friends**: Add or remove friends from your list. ✨



---

Thank you for checking out **Film Ranking**! We hope you enjoy using it as much as we enjoyed building it. 😃
