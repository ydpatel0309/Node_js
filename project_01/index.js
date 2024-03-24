const http = require('http');
const express = require('express');
const users = require("./MOCK_DATA.json");
const fs = require('fs');

const app = express();

//Middlewere - Plugin
app.use(express.urlencoded({extends: false}));

//routes
app.get("/users",(req,res)=>
{
    const html = `
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>`;
    res.send(html);
})
app.get("/api/users",(req,res)=>
{
    res.json(users);
})

//dynamic path parameters
//  GET/api/users/:id
app. route("/api/users/:id")

.get((req,res)=>
{
    const id =Number(req.params.id);
    const user = users.find((user)=> user.id === id);
    if(user)
    return res.json(user);
    else res.json({status: "not available"});
})
.patch(((req,res)=>
{   //edint user with id
    
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
        const updatedUser = { ...users[userIndex], ...req.body }; // Merge existing user data with updated data from request body
        users[userIndex] = updatedUser;
        fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                console.log("Error writing to JSON file:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            else
            {
                return res.json({ status: "success", updatedUser });
            }
        });
    } else {
        return res.status(404).json({ error: "User not found" });
    }
}))
.delete(((req,res)=>
{ //delete user with id
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
        //splice will remove user
        users.splice(userIndex, 1);

        // Write updated users data to the JSON file
        fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                console.log("Error writing to JSON file:", err);
            }
            else
            {
                return res.json({ status: "success" });
            }
        });
    }
    else {
        return res.status(404).json({ error: "User not found" });
    }
   
}))

app.post("/api/users",(req,res)=>
{
    const body = req.body;
    users.push({id : users.length+1 ,...body});
    fs.writeFile("MOCK_DATA.json",JSON.stringify(users),(err,data)=>
    {
        if(err) console.log("Error",err);
        else  return  res.json({sttus: "success", id :users.length})
    })
  
})

//insted of writign different we can write in one go :- good practice

// app.patch("/api/users/:id",(req,res)=>
// {
//     return res.json({sttus: "pending"})
// })


// app.delete("/api/users/:id",(req,res)=>
// {
//     return res.json({sttus: "pending"})
// })

const PORT = 8000;
app.listen(PORT,(req,res)=>
{
    console.log(`server is running on port ${PORT}`);
})