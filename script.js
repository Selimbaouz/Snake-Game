window.onload = function()
{
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var snakeeColors =
        [
            "#FFFF00",
            "#FF0000",
            "#0000FF",
            "#ecbd54",
            "#f25f5c",
            "#ae6b34",
            "#5cba47",
            "#2a3662",
            "#917a84",
            "#e0d56a",
            "#78bce3"
    ];
    var timeout;

    init();

    //Fonction qui crée le canvas
    function init()
    {
        //Création du canvas
        var canvas = document.createElement('canvas');
        //Taille du canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        //Bordure du canvas
        canvas.style.border = "10px solid gray";
        canvas.style.margin = "auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        //Lien avec le html
        document.body.appendChild(canvas);
        //Création du contexte en 2d
        ctx = canvas.getContext('2d');
        //Rafraichissement du canvas par sa fonction
        snakee = new Snake([[6,4],[5,4],[4,4]], "right"); //Création du serpent avec ses 3 premiers blocks défini par la fonction snake(body)
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    //Fonction qui rafraichi le canvas toutes les ...secondes défini par delay.
    function refreshCanvas()
    {
        snakee.advance(); //Permet de faire avancer le serpent à chaque rafraichissement de la page

        if(snakee.checkCollision())
        {
            gameOver();
        }
        else
        {

            if (snakee.isEatingApple(applee))
            {
                colorSnake(); //Donne une nouvelle couleur à chaque prise de pomme (couleur définie grâce à la variable snakeeColors)
                score++; //Augmente le score
                delay -= 2; //Augmente la vitesse
                snakee.ateApple = true; //Oui le serpent à mangé la pomme
                do
                    {
                    applee.setNewPosition();
                    }
                while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight); //Effacer tout le canvas
            drawScore();
            snakee.draw(); //Permet de dessiner le serpent à chaque rafraichissement de la page
            applee.draw(); //Permet de dessiner la pomme à chaque rafraichissement de la page
            timeout = setTimeout(refreshCanvas,delay); //Défini un temps pour rafraichir le canvas toutes les 100s
        }
    }

    function gameOver()
    {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche espace pour rejouer !",centreX,centreY - 120);
        ctx.fillText("Appuyer sur la touche espace pour rejouer !",centreX,centreY - 120);
        ctx.restore();
    }

    function restart()
    {
        clearTimeout(timeout); //Effacer l'ancier timeout
        //Rafraichissement du canvas par sa fonction
        snakee = new Snake([[6,4],[5,4],[4,4]], "right"); //Création du serpent avec ses 3 premiers blocks défini par la fonction snake(body)
        applee = new Apple([10,10]);
        delay = 100;
        score = 0;
        refreshCanvas();
    }

    //Permet d'afficher le score à l'écran
    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif"
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    //Fonction qui dessine le block
    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize; //La position du block multiplié par la taille du block
        var y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize); //Création d'un rectangle avec une position x et y avec une taille du block = blockSize.
    }

    //Fonction qui crée le serpent
    function Snake(body, direction)
    {
        //Le corps du serpent
        this.body = body;
        this.direction = direction; //Méthode qui permet d'avoir la direction du serpent
        this.ateApple = false; //Est-ce que le serpent à mangé la pomme ? sur Faux
        //Méthode qui va déssiner le corps du serpent dans le canvas
        this.draw = function()
        {
            ctx.save(); //Sauvegarde le contexte du canvas (le contenu) comme il était avant
            //ctx.fillStyle = #ff0000; //Création de la couleur du rectangle / Remplacer par la méthode this.colorSnake();
            //Tant que i est inférieur au nombre de block alors on augmente de +1
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]); //Function qui permet de dessiner un block, (on met le ctx dans laquelle il va dessiner dans le canvas) et la position du block à dessiner.
            }
            ctx.restore(); //Garde le context comme il était avant
        };
        //Méthode qui permet de faire avancer le serpent :
        this.advance = function()
        {
            var nextPosition = this.body[0].slice(); //Permet de copier grâce à slice() l'élément de la tête du serpet this.body[0]
            //On va faire avancer la tête du serpent en fonction de la position émise par l'utilisateur
            switch (this.direction)
            {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid direction");
            }
            this.body.unshift(nextPosition) //Rajout de la nouvelle position donc la nous avons 4 block et non 3 grâce à unshift(nextPosition) donc [7,4] derriere [6,4]
            if(!this.ateApple) //Si le serpent n'a pas mangé de pomme alors
            {
                this.body.pop(); //Supprime le dernier élèment du array donc le dernier block 4,4
            }
            else
            {
                this.ateApple = false; //Grâce à false, le serpent grandi, car il n'a pas la fonction suppression d'un block (pop)
            }
        };
        //Méthode qui permet de donner la direction
        this.setDirection = function(newDirection)
        {
            //Variable des directions permises
            var allowedDirections;
            switch (this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Invalid direction");
            }
            //Si la nouvelle direction
            if(allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        };
        //Méthode pour créer les collisions
        this.checkCollision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0]; //Tête du serpent
            var rest = this.body.slice(1); //Le reste du corps du serpent
            var snakeX = head[0]; //Position de la tête du serpent à l'horizontal
            var snakeY = head[1]; //Position de la tête du serpent à la verticale
            var minX = 0; //Longeur du canvas à 0
            var minY = 0; //Hauteur du canvas à 0
            var maxX = widthInBlocks - 1; //Longeur du canvas au dernier block
            var maxY = heightInBlocks - 1; //Hauteur du canvas au dernier block
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; //Elle n'est pas entre les murs horizontales
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            //Si le serpent n'est pas entre les murs horizontales et verticales alors il y a une collision au niveau du mur
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollision = true;
            }
            //Boucle qui montre que le serpent à une collision si la tête horizontale (snakeX) et verticale (snakeY) touche le corps (rest)
            for(var i = 0; i < rest.length; i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                }
            }
            //On retourne la collision du mur ou la collision du serpent
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat)
        {
          var head = this.body[0];
          if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
          {
              return true;
          }
          else
          {
              return false;
          }
        };
    }

    //Donne un nombre au hasard
    function getRandomElement(array) {
        if (array.length == 0) {
            return undefined;
        }
        return array[Math.floor(Math.random() * array.length)];
    }

    //Permet d'avoir des couleurs différentes à chaque fois que snake touche la pomme
    function colorSnake()
    {
        ctx.beginPath();
        ctx.fillStyle = getRandomElement(snakeeColors);
        ctx.fill();
        ctx.closePath;
    }

    //Fonction qui construit la pomme
    function Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
          ctx.save();
          ctx.fillStyle = "#33cc33";
          //Création de la pomme en cercle :
          ctx.beginPath();
          var radius = blockSize/2; //Le rayon du cercle
          var x = this.position[0] * blockSize + radius; //Position x du cercle
          var y = this.position[1] * blockSize + radius; //Position y du cercle
          ctx.arc(x,y,radius,0, Math.PI*2, true); //Création du cercle vide
          ctx.fill(); //Remplissage du cercle
          ctx.restore();
        };
        //Place une nouvelle position à la pomme
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random() * (widthInBlocks - 1)); // Variable nombre au hasard à l'horizontale
            var newY = Math.round(Math.random() * (heightInBlocks - 1)); // Variable nombre au hasard à la verticale
            this.position = [newX, newY]; //On donne cette position à notre pomme
        };
        //Pour éviter que la pomme atterrie par hasard sur le serpent on créer cette méthode :
        this.isOnSnake = function(snakeToCheck)
        {
          var isOnSnake = false;

          for(var i = 0; i < snakeToCheck.body.length; i++)
          {
              if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
              {
                  isOnSnake = true;
              }
          }
          return isOnSnake;
        };
    }


    //Permet de fixer la direction en fonction de la touche appuyé par l'utilisateur
    document.onkeydown = function handleKeyDown(e)
    {
        var key = e.keyCode;
        var newDirection;
        switch (key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}
