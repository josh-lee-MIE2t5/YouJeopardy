const mongoose = require("mongoose");
const Game = require("../models/game.js");
const User = require("../models/user");

mongoose.connect("mongodb://localhost:27017/youjeopardy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Mongo connected");
});

async function seedDb() {
  await Game.deleteMany({});
  const firstgame = new Game({
    title: "first game",
    access: "public",
    categories: [
      {
        name: "Food and Drink",
        questions: [
          {
            points: 200,
            body: "Sliced apples sautéed in butter are a classic filling for these French pancakes.",
            answer: "Crepes",
          },
          {
            points: 400,
            body: "To make mousse d'ecrevisses, you need at least 30 of these freshwater crustaceans.",
            answer: "Crayfish",
          },
          {
            points: 800,
            body: "Many a French meal ends with a dry red wine served with this blue-veined treat, the “cheese of kings and popes.”",
            answer: "Roquefort",
          },
          {
            points: 1000,
            body: "This chilled leek & potato soup is traditionally topped with chopped chives.",
            answer: "Vichyssoise.",
          },
        ],
      },
      {
        name: "Theater, Plays, and Folklore",
        questions: [
          {
            points: 200,
            body: "In 1965, at age 20, Helen Mirren played this Egyptian at the Old Vic.",
            answer: "Cleopatra",
          },
          {
            points: 400,
            body: "How fitting that she starred in “Twelfth Night” in 2009—she has the same name as Shakespeare's wife.",
            answer: "Anne Hathaway",
          },
          {
            points: 800,
            body: "He received acting & directing Oscar nominations for 1989's “Henry V.”",
            answer: "Kenneth Branagh",
          },
          {
            points: 1000,
            body: "In 1993 Lynn Redgrave premiered her 1-woman show “Shakespeare for My Father,” dedicated to this man.",
            answer: "Michael Redgrave",
          },
        ],
      },
      {
        name: "Animals",
        questions: [
          {
            points: 200,
            body: "Koalas have adapted their diet with an extra-long gut to break down poisons in these leaves & sleep 20 hours a day due to a lack of nutrition in the leaves.",
            answer: "Eucalyptus",
          },
          {
            points: 400,
            body: "The eastern gray kangaroo can cover 25 feet in a single leap, & they're widespread in this, the country's smallest state.",
            answer: "Tasmania",
          },
          {
            points: 800,
            body: "It's the world's largest burrowing animal & can make a destructive tunnel complex 650 feet long, so farmers don't find it as cute as zoo-goers might.",
            answer: "A wombat",
          },
          {
            points: 1000,
            body: "The arrival of foxes in Western Australia in the 1920s was bad news for the quokka, a type of this kangaroo relative.",
            answer: "A wallaby",
          },
        ],
      },
      {
        name: "Music",
        questions: [
          {
            points: 200,
            body: "She had 3 of Billboard's Top 20 songs of 2015, including “Bad Blood.”",
            answer: "Taylor Swift",
          },
          {
            points: 400,
            body: "This singer's 2021 hit “Take My Breath” is perfect for a Saturday or Sunday.",
            answer: "The Weeknd",
          },
          {
            points: 800,
            body: "Do start now & name this English-born woman of Albanian ancestry who was “Levitating” up the charts in 2021.",
            answer: "Dua Lipa",
          },
          {
            points: 1000,
            body: "In 1995 this one-named singer rose to the top of the charts with “Kiss From A Rose.”",
            answer: "Seal",
          },
        ],
      },
    ],
    author: await User.findById("62f9bd019355aa910772105d"),
  });

  // const secondgame = new Game({
  //   title: "second game",
  //   access: "private",
  //   categories: [
  //     {
  //       name: "Food and Drink",
  //       questions: [
  //         {
  //           points: 200,
  //           body: "Sliced apples sautéed in butter are a classic filling for these French pancakes.",
  //           answer: "Crepes",
  //         },
  //         {
  //           points: 400,
  //           body: "To make mousse d'ecrevisses, you need at least 30 of these freshwater crustaceans.",
  //           answer: "Crayfish",
  //         },
  //         {
  //           points: 800,
  //           body: "Many a French meal ends with a dry red wine served with this blue-veined treat, the “cheese of kings and popes.”",
  //           answer: "Roquefort",
  //         },
  //         {
  //           points: 1000,
  //           body: "This chilled leek & potato soup is traditionally topped with chopped chives.",
  //           answer: "Vichyssoise.",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Theater, Plays, and Folklore",
  //       questions: [
  //         {
  //           points: 200,
  //           body: "In 1965, at age 20, Helen Mirren played this Egyptian at the Old Vic.",
  //           answer: "Cleopatra",
  //         },
  //         {
  //           points: 400,
  //           body: "How fitting that she starred in “Twelfth Night” in 2009—she has the same name as Shakespeare's wife.",
  //           answer: "Anne Hathaway",
  //         },
  //         {
  //           points: 800,
  //           body: "He received acting & directing Oscar nominations for 1989's “Henry V.”",
  //           answer: "Kenneth Branagh",
  //         },
  //         {
  //           points: 1000,
  //           body: "In 1993 Lynn Redgrave premiered her 1-woman show “Shakespeare for My Father,” dedicated to this man.",
  //           answer: "Michael Redgrave",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Animals",
  //       questions: [
  //         {
  //           points: 200,
  //           body: "Koalas have adapted their diet with an extra-long gut to break down poisons in these leaves & sleep 20 hours a day due to a lack of nutrition in the leaves.",
  //           answer: "Eucalyptus",
  //         },
  //         {
  //           points: 400,
  //           body: "The eastern gray kangaroo can cover 25 feet in a single leap, & they're widespread in this, the country's smallest state.",
  //           answer: "Tasmania",
  //         },
  //         {
  //           points: 800,
  //           body: "It's the world's largest burrowing animal & can make a destructive tunnel complex 650 feet long, so farmers don't find it as cute as zoo-goers might.",
  //           answer: "A wombat",
  //         },
  //         {
  //           points: 1000,
  //           body: "The arrival of foxes in Western Australia in the 1920s was bad news for the quokka, a type of this kangaroo relative.",
  //           answer: "A wallaby",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Music",
  //       questions: [
  //         {
  //           points: 200,
  //           body: "She had 3 of Billboard's Top 20 songs of 2015, including “Bad Blood.”",
  //           answer: "Taylor Swift",
  //         },
  //         {
  //           points: 400,
  //           body: "This singer's 2021 hit “Take My Breath” is perfect for a Saturday or Sunday.",
  //           answer: "The Weeknd",
  //         },
  //         {
  //           points: 800,
  //           body: "Do start now & name this English-born woman of Albanian ancestry who was “Levitating” up the charts in 2021.",
  //           answer: "Dua Lipa",
  //         },
  //         {
  //           points: 1000,
  //           body: "In 1995 this one-named singer rose to the top of the charts with “Kiss From A Rose.”",
  //           answer: "Seal",
  //         },
  //       ],
  //     },
  //   ],
  // });
  await firstgame.save();
  // await secondgame.save();
}
seedDb().then(() => {
  db.close();
});
