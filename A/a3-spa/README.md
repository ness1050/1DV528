# A3 SPA 
nq222af

F1-F5 done
The application interface is more like a window type desktop with having the navbar of the appliction at the bottom of page.
The navBar is colorless unless until when you hover over it. Where it contain different type of Application, the applications are specificly for the window container where we first have the main window-space where if the applications are opened by the user, so the window-space will contain the apps, for SPA.
To run the code you need to clone the git dir later on you have to cd inside the src to be able to run the npm run http-server where the page will start with some website options.
After starting the game you are able to open as many apps as possiable, the windows are minimize, maximize, hide and closable.
The memory can be played both with mouse or keyboard buttons, and the same goes for the tictactoe game.
Memory game is more like matching the poke cards and the attemps are counted each time, there is a hint button to help.
Tic-tac-toe game is more like you have to click start button to choice the x and click on the interface on tictac game to be able to navigate with keyboards keys, there is x player and o player, the game can be restarted, quit and started.
The chat can be used for the first time with entering you nickname or real name depanding on you, then you can start chatting with people who are also connected to the same server as you.

F6: requirment done.
Check the class diagram in Window_img folder.
There is main script which connects the primary classes of the apps, where the intances of other classes which handles the overall environment of applications.
The chat handles user interaction such as message sending and displaying of it, where it includes some functions such as checkname for validiting, sendingMsg(msg), encrypting/decrypting messages, where it uses the websocket for sending and receicing the messages
Where the websocket is for handling real-time messaging. It includes function for name chaning, selecting channel and also clearing the chat history. user can choice an emoji where the emojigenereter provides an interface for a range of emojis.
The channel-select opition is more in what the user is interseted of joing the group type. The usernamechange feature is to make it able for the user to update thier identity while particitpiting of converistion.
And message encryption/decryptiong is more about securing communiciton in channel, for ensuring the privecy for sensitive or private conversition.

F7: list(checked) done:
Overall the pwd(itself) works as centeral interface for the webpage, which creates a window desktop looking environment in the browser. which allows a flexiable opening of different apps, it include the dynamic windows system which manages apps windows, such as features like moving and focusing.
The Memory game, offers interactive and engaging experience specially those who loves pokemon cards, where the improvement this includes a responsive userinterface and adapting the difficulty different level of games, which the pwd  allows it to run seperate window providing multitasking feelings.
The tic-tac-toe game is an easy and simple game, where both playing and the style is very simply handled, it has a feature grid where the users can play against each other, like marking the Like X's and O's, the game has to follow some patterns to check which mark or player has won the game and like the memory game it has its own window in the PWD enviroment and you can as many window possiable, giving a complete gaming experience, the game controlled with mouse or keyboard but for keyboard navigation the first click when the app is opened has to be on the grid board then user is able to navigate with keybnoard and mark the grid cells with enter.
The windBar&topBar include functions that handles the maximizing and normalizing of app window, user is able to toggle between full and normal size view where the window size gets increased within a range.
Keeping track open windows, the system keeps the app icone if the are open or active area, and also the user are able to hide the app without closing it, managing the screen spac and focusing the specific task it enhance more the like being able to multitasking and user-friendly.

F8
The code module is divide in several parts such as each game has their own classes and the chat has own class, there is a websocket class which is used by the chat to make sure the real-time messaging through the server, every application is handled by the main core which the webBarandtopBar class where it manages all other classes, and the script works like a main.
The main is to run the web-browser where later the windbar&top is controller and manager of the enviroment for the appliciton windows which contains intances of Chat,Memory,tictac.
The chat class includes the functionilty for giving the user the experince of real chat app, to send message and recieve and addtional features like being able to send emojis beside only text, encrypting/decrypting message ensuring the user feels experience of having the privacy option.
The Memory class includes all functionilty of a playable game. it includes a constructor sets the intial state and layout of the game including different division of game, creating the game and start division, allowing the user to select the game level and start the game, by creating and arranging the cards and adding the eventlistner for gameply. Handling the flip actions when cards are flipped, where it checks if the flipped cards are a pair, counting each attempt, where the cards-division clicks has event listener from a card to addlistener or removelistener. keys event are used for the navigation of game throw keyboard.
The tictac class contain a constructor where it initialize the userinterface and sets up the event listeners, has a control panel where the score,start, quit and restart funcitons are handled, the gameboard is sets as board with clickable cells, the handleclick is for ensuring the clicks for the marking the cells and updating gameboard also checking the winner through some pattern according to tictactoe games. The game can be played by two player one who will mark as x and the other as o to mark the boxes. The player is not able to click or mark until not clicks the start btn and then the user can both with mouse or keyboard navigate the game. The score will be added for each player until not clicked the quit button.
