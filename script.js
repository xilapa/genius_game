var player = {
    colorSequence: [],
    defaultTime: 3000, // 3s, a cor fica metade do ciclo aceso e metade apagada
    clickLightTime: 500, // 0.5s. tempo que a luz fica acesa ao ser clicada 
    score: 0,
    clickCounter: 0,
    clickedClass: 'empty',
    lightColorConcluded : false
}


// 0 - verde
// 1 - vermelho
// 2 - amarelo
// 3 - azul

function incrementColorSequence(_player){
    let generateColor = () => {
        let rand = Math.floor(Math.random() * 4);
        // The Math.random() function returns a floating-point, pseudo-random number in the range 0 to less than 1 (inclusive of 0, but not 1) 
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random 
        console.log(`random number generated: ${rand}`)
        let color;
        switch (rand){
            case 0:
                color = 'green';
                console.log(`equivalent color added: ${color}`)
                return color;

            case 1:
                color = 'red';
                console.log(`equivalent color added: ${color}`)
                return color;
            case 2:
                color = 'blue';
                console.log(`equivalent color added: ${color}`)
                return color;
            case 3:
                color = 'yellow';
                console.log(`equivalent color added: ${color}`)
                return color;
        }
    }
    _player.colorSequence.push(generateColor());
    console.log(`actual colorSequence: ${_player.colorSequence}`);
    return _player;
}

function lightSequence(_player){
   
    function lightColor(_color,index,_player){
        
        let unlightTime = _player.defaultTime * (index + 1);
        let lightTime = unlightTime - (1/2 * _player.defaultTime);
        
        setTimeout(()=>{
            document.querySelector('.' + _color).classList.add('selected');
            console.log(`color ${_color} on`);
        }, lightTime);

        setTimeout(()=>{
            document.querySelector('.' + _color).classList.remove('selected');
            console.log(`color ${_color} off`);
        }, unlightTime);

        // checa se todas as luzes foram acesas
        if (index == _player.colorSequence.length - 1){
            setTimeout(()=>{
                _player.lightColorConcluded = true;
                document.querySelector('.info').innerHTML = "Sua Vez!";
                return _player;
            },unlightTime); 
        }
    }

    _player.colorSequence.map((color,index)=>{
        console.log(`lightSequence.map started at colorSequence index ${index}`);
        lightColor(color,index,_player);

    })
}

function createClickListener(_player){
    let observers = [];

    function subscribe(observerFunction){
        observers.push(observerFunction);
    }

    function notifyAll(_player){
        console.log(`notifying ${observers.length} observers`);
        for (observerFunction of observers){
            observerFunction(_player);
        }
    }

    

    function clickHandler(_player){
        return function(event){
            _player.clickedClass = event.path[0].className;
            console.log(`clicked at ${_player.clickedClass}`);
            notifyAll(_player);
        };
    };

    document.addEventListener('click', clickHandler(_player));



    return {subscribe}
}

function checkClickedOrder(_player){

    let colors = ['green','red','blue','yellow'];
    if(colors.includes(_player.clickedClass)){
    // verifica se a classe clicada é uma cor valida e não uma outra classe fora do jogo

        if (!_player.lightColorConcluded){
            // evita cliques logo após a cor apagar
            _player.clickCounter += 1;
            console.log('clicked before all lights turn off');
            setTimeout(() => {
                customAlert('Clicou antes da hora!', `Sequência(s) correta(s): ${_player.score}<pre>
                </pre> Espere todas as luzes apagarem na próxima vez! 
                <pre>
                </pre>`,'reiniciar');
            }, _player.clickLightTime * 1.5);
            

            
        }else{
            if (_player.clickedClass == _player.colorSequence[_player.clickCounter]){
                console.log('correct click');
                _player.clickCounter += 1;
                if (_player.clickCounter == _player.colorSequence.length){
                    _player.score += 1; 
                    _player.clickCounter = 0;
                    _player.lightColorConcluded = false;
                    console.log(`score: ${_player.score}`);
                    setTimeout(() => {
                        customAlert('Você acertou!', `Sequências correta(s): ${_player.score} `,'continuar');
                    }, _player.clickLightTime * 1.5);
                    
             
                }
            }else{
                console.log('wrong click');
                _player.clickCounter += 1;
                setTimeout(() => {
                    customAlert('Você errou!', `Sequências correta(s): ${_player.score} `,'reiniciar');
                }, _player.clickLightTime * 1.5);
                
    
            }
        }   
    }
}

function customAlert(alertHeader,alertMessage,alertButton){

    let alertBoxWidth = 300;

    let alertOverlay = document.querySelector('.alert-overlay');
    let alert = document.querySelector('.alert');

    function render(){
        alertOverlay.style.display = 'block';

        alert.innerHTML = '<div class="alert-header"></div><div class="alert-body"></div><div class="alert-footer"></div>'
        alert.style.display = 'flex';
        alert.style.width = alertBoxWidth + 'px';
        alert.style.left = (window.innerWidth/2) - (alertBoxWidth/2) +'px';
        alert.style.top = '10vh';

        document.querySelector('.alert-header').innerHTML = alertHeader;
        document.querySelector('.alert-body').innerHTML = alertMessage;
        document.querySelector('.alert-footer').innerHTML = '<button class="button-ok" onclick="ok();">' + alertButton +'</button>';
    
    };
    
    // função global para ser chamada fora do contexto startGame
    ok = function ok(){
        alertOverlay.style.display = 'none';
        alert.style.display = 'none';
    }

    render();  


}

function nextLevel(_player){
    if (_player.clickedClass =='button-ok' &&  _player.clickCounter == 0){
        // o botão ok só irá existir quando chamado pela função que checa a ordem dos cliques
        // quando o botão é criado o clickCounter é resetado
        document.querySelector('.info').innerHTML = "Aguarde";
        _player = incrementColorSequence(_player);
        _player = lightSequence(_player);  
    }

}

function restartGame(_player){
    if (_player.clickedClass =='button-ok' &&  _player.clickCounter != 0){
        // o botão ok só irá existir quando chamado pela função que checa a ordem dos cliques
        // quando o botão é criado o clickCounter não é resetado
        document.querySelector('.info').innerHTML = "Aguarde";     
        location.reload();
    } 
}

function lightOnClick(_player){
    let colors = ['green','red','blue','yellow'];
    if(colors.includes(_player.clickedClass)){ 
        document.querySelector('.' + _player.clickedClass).classList.add('selected');
        setTimeout(()=>{
            document.querySelector('.' + _player.clickedClass).classList.remove('selected');
            console.log(`color ${_player.clickedClass} on by player click`);
        }, _player.clickLightTime);
    }

}


function startGame(_player){
    console.log('jogo iniciado');
    let clickListener = createClickListener(_player);
    clickListener.subscribe(checkClickedOrder);
    clickListener.subscribe(nextLevel);
    clickListener.subscribe(restartGame);
    clickListener.subscribe(lightOnClick);

    _player = incrementColorSequence(_player);
    _player = lightSequence(_player); 


     
}

startGame(player);