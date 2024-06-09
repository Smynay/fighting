# About project

---

It`s a step-by-step fighting game that can be launched in **CLI** and **Server mode**.
Game supports a two different gameplay modes such as **PvP** (only for Server) and **PvE**.

Game goal is win your opponent. For achieve this goal you should make the right decisions,
based on current game statistic and opponent actions.

Look at statistic, choose your action and crush some faces!

Please enjoy!

### How to play in CLI?

1. Install [Node.js](https://nodejs.org/en)
2. Open terminal at the project location
3. Run ```npm run plug-n-play``` in your terminal


## Documentation

---

### Terms

***action*** - game step (tick)

***round*** - pack of actions

***match*** - pack of rounds


### Entites

***Action*** - uses for update actors by described action conditions

***Calculator*** - uses for prepare and execute selected by actor actions

***Counter*** - uses for encapsulation logic of various counters 

***Actor*** - uses for storing actor params and business logic

***AI*** (artificial intelligence) - uses for mock real user behavior for PvE game mode

***Controller*** - uses for storing game params and game logic

