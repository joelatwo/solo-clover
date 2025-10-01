This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Here's my initial project. Can you ask me questions about it until you feel like you have the complete prompt to build it. I want to build a nextjs webapp that's statically site generated. Do not include a backend

I want to create a square with 4 words that go along the inside edge. It should have the ability to keep track of it's rotation and be drag and droppable into a given section. It also needs to be able to rotate. From this point onward I will refer to this as a card.
I want to create a square with 4 words that go along the outside edge. It will also have 1 slot in each corner that I can insert one of my cards into. I will refer to this as a puzzle.
Now that we've got the components out of the way let's talk about the rules of the game. Given the 4 words on the puzzle and 5 cards the user will have to determine which cards go into each slot so that the 1 side puzzle word lines up with the 2 cards words of the same side. Once I have the 4 cards placed i want the option to test and see if I've got them in the correct position and rotation. If I get it right the first time I want to get 6 points. If I get it right the second time I get 5 points. Otherwise I get 1 point per correct answer, with no more attempts. I want to save my score in local storage. I want to load the puzzles and cards from json file based on the day of the week although for testing that should probably be toggleable.
Card drag and drop functionality with react-dnd
Card rotation system (90-degree increments)
Puzzle grid with word boundary matching
Daily puzzle system with 7 different puzzles
Scoring system based on attempts (6/5/1 points)
Local storage for score persistence
Here is an example of a daily puzzle. For now let's also keep this as the default rather than assigning it to a particular day
{
"puzzles": [
{
"id": "8/31/2025",
"cards": [
{
"id": "card1",
"words": ["Essence", "Joke", "Hospital", "Roast"],
"rotation": 0
},
{
"id": "card2",
"words": ["Award", "Fly", "Calendar", "Skull"],
"rotation": 0
},
{
"id": "card3",
"words": ["Eye", "Sea", "Bouquet", "Box"],
"rotation": 0
},
{
"id": "card4",
"words": ["Building", "Boxing", "First", "Fever"],
"rotation": 0
},
{
"id": "card5",
"words": ["Toy", "Basket", "Weak", "Knight"],
"rotation": 0
}
],
"puzzleSlots": {
"top": {
"clue": "Oscars",
"words": ["Essence", "Award"]
},
"right": {
"clue": "Gull",
"words": ["Fly", "Sea"]
},
"bottom": {
"clue": "Date",
"words": ["Bouquet", "First"]
},
"left": {
"clue": "Hot",
"words": ["Roast", "Fever"]
}
}
}
]
}
I've also included some screenshots in the screenshot folder I would also like as a simple mockup
What else would be helpful
