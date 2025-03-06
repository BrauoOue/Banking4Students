const colors = ["bg-red-400", "bg-green-400", "bg-yellow-400", "bg-orange-400"]

const billDropdown = ["Receipt", "Online"]
const methodDropdown = ["By items", "Divide bill equally"]

const participants = [
    {id: "0", name: "Me", color: colors[0]},
    {id: "1", name: "NJ", color: colors[1]},
    {id: "2", name: "VK", color: colors[2]},
    {id: "3", name: "AS", color: colors[3]}
];

const billItems = {
    "items": [
        {
            "itemName": "Oysters Dozen",
            "amount": 1,
            "price": 2.61
        },
        {
            "itemName": "Clam Chowder",
            "amount": 1,
            "price": 5.50
        },
        {
            "itemName": "Grilled Lobster",
            "amount": 1,
            "price": 12.49
        },
        {
            "itemName": "Crab Cakes",
            "amount": 2,
            "price": 8.75
        },
        {
            "itemName": "Fish Tacos",
            "amount": 3,
            "price": 6.25
        },
        {
            "itemName": "Shrimp Scampi",
            "amount": 1,
            "price": 11.50
        },
        {
            "itemName": "Fried Calamari",
            "amount": 1,
            "price": 20.00
        },
        {
            "itemName": "Salmon Fillet",
            "amount": 2,
            "price": 13.45
        },
        {
            "itemName": "Clam Bake",
            "amount": 1,
            "price": 15.49
        },
        {
            "itemName": "Steamed Mussels",
            "amount": 1,
            "price": 7.25
        }
    ],
    "total": 104.29,
    "warning": null
}

