The Test player is basically a bare bones client, primarily built to test MSS protected streams 
on IE 11, IE Edge (Windows 8, Windows 10). Nothing fancy, and not production code.

To run the player
------------------
1. npm install
2. npm start
3. Run ```http://localhost:3000/```
4. Select the drop down value and hit ```Load``` button.
5. Success or Failure response from Playready Server is logged on the console for debugging.
6. To play your own streams you can modify the ```mediaTypes``` object in ```client.js``` and ```mediaTypes``` dropdown (!!) to test.
7. Make sure you are on a network on which you can access whichever Playready Service and the manifest URL, you are using.
