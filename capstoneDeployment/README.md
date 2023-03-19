# Group_16_Capstone

What do I need in order to run this project?

- Node above version 16

How to use this repo?

- Once cloned CD into the client/ues-connect-client folder
- Run the following command: `npm i`, This will install all necessary dependencies
- Now to launch the project run: `npm run dev`
- From here you can launch your favourite browser and go to: `http://localhost:3000/`
- If you wish to purely use the backend API interface go to: `http://localhost:3000/api/graphql`
  - This will launch the Apollo Graphql Interface. This is very similar to Postman, however, these are Graphql endpoints and there for are not the same
  as classical REST endpoints. I would advise looking at documentation here in order to understand how these queries work: https://www.apollographql.com/docs/graphos/explorer/sandbox/
- If you wish to access the front end (yes they are connected right now and work in unison by just running the npm run dev command) you can choose to either look at the student view, or the club view.
  - The club view will require a username and password. You can use the following dummy credentials: username`test@gmail.com` and password: `password`
  - The student view has no login (yes this was a design choice)
- If you wish to see only the mongoDB server that we have set up you can use the following URI key: `mongodb+srv://gabor:group16@cluster0.epckap1.mongodb.net/?retryWrites=true&w=majority`. (yes this is also connected to the backend and as such is connected to the front end as well)
  - If you have never used mongoDB before this URI key gives you access to the database and you can simply go to mongoDB's website, sign up, and place this into their web portal in order to be able to view all the collections.


Email: group16se4450@gmail.com
Password: Dune123456
