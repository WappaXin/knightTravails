function getPossibeleVerticesOf(knightPosition){
    const [x , y] = knightPosition;
    
    let positionsOfKnight = [
       [x - 2 , y + 1] ,
       [x - 2 , y - 1] ,
       [x - 1 , y + 2] , 
       [x - 1 , y - 2] ,
       [x + 2 , y + 1] , 
       [x + 2 , y - 1] , 
       [x + 1 , y + 2] , 
       [x + 1 , y - 2]
   ];
   
    for(let i = positionsOfKnight.length - 1 ; i >= 0 ; i--){
       const outOfTheBoard = positionsOfKnight[i].filter((element) => { return (element > 7 || element < 0); });
   
       if(outOfTheBoard.length > 0) positionsOfKnight.splice(i , 1);
    }
   
    return positionsOfKnight;
   
}

let totalNumberOfPaths = 0;

function createEdgeList(array , targetPosition , edgeList = []){
    // we are using que to keep track of the depths of the tree
    // basically BFS

    edgeList.push(...createEdges(array[0] , targetPosition));
    if(totalNumberOfPaths > 0) return edgeList;
    array.push(...getPossibeleVerticesOf(array[0]));
    array.shift();

    function step(array , targetPosition , edgeList){
        for(let i = 0 ; i < array.length ; i++){
            edgeList.push(...createEdges(array[i] , targetPosition));
            if(totalNumberOfPaths > 0) return edgeList;
            array.push(...getPossibeleVerticesOf(array[i]));
            array.shift();
        }
    
        if(totalNumberOfPaths > 0) return edgeList;
    
        if(totalNumberOfPaths === 0) return createEdgeList(array1 = [...array] , targetPosition , edgeList);
    }

    return step(array , targetPosition , edgeList);
}

function createEdges(currentPosition , targetPosition){
    let edges = [];
    const possiblePositions = getPossibeleVerticesOf(currentPosition);

    for(let i = 0 ; i < possiblePositions.length ; i++){
        edges.push([ currentPosition , possiblePositions[i] ]);
    }

    // since createEdges only takes one position
    // there can be only one target position from given position
    // so every time it finds one target it adds to the total
    if(checkTarget(possiblePositions , targetPosition)){
        totalNumberOfPaths++;
    }

    return edges;
}

function checkTarget(possiblePositions , targetPosition){
    for(let i = 0 ; i < possiblePositions.length ; i++){
        if(possiblePositions[i].every((element , index) => element === targetPosition[index])){
            return true;
        }
    }

    return false;
}

function getNextEdge(edge , edgeList1){
    for(let i = 0 ; i < edgeList1.length ; i++){
        if(checkArrayEquality(edge[1] , edgeList1[i][0])){
            return edgeList1[i];
        }
    }

    return null;
}

function checkArrayEquality(arrayA , arrayB){
    return arrayA.every((element , index) => element === arrayB[index]);
}

function removeEdge(edge , edgeList1){
    for(let i = 0 ; i < edgeList1.length ; i++){
        if(checkArrayEquality( edge[0] , edgeList1[i][0] ) &&
            checkArrayEquality( edge[1] , edgeList1[i][1]) ){
                edgeList1.splice(i , 1);
                return true;
            }
    }

    return false;
}

function getPath(edgeList1 , initialPositionPPS , targetPosition){
    
    let path;
    parentLoop: for(let i = initialPositionPPS.length - 1 ; i >= 0 ; i--){
        let initialEdge = initialPositionPPS[i];

        if(checkArrayEquality(initialEdge[1] , targetPosition )){
            path = [initialEdge];
            return path;
        }
        let nextEdge0 = getNextEdge(initialEdge , edgeList1);

        if(nextEdge0 === null){
            removeEdge(initialEdge , initialPositionPPS);
            i = initialPositionPPS.length;
            continue parentLoop;
        }

        if(checkArrayEquality(initialEdge[0] , nextEdge0[1]) && 
        checkArrayEquality(initialEdge[1] , nextEdge0[0])){
            removeEdge(nextEdge0 , edgeList1);
            i = initialPositionPPS.length - 1;
            continue parentLoop;
        }
      
        function step(startingEdge){
            let nextEdge = getNextEdge(startingEdge , edgeList1);
            // base case is to find target
            if(nextEdge === null){
                removeEdge(startingEdge , edgeList1);
                return [startingEdge];
            }
            if(checkArrayEquality(startingEdge[0] , nextEdge[1]) && 
                checkArrayEquality(startingEdge[1] , nextEdge[0])){
                    removeEdge(nextEdge , edgeList1);
                    nextEdge = getNextEdge(startingEdge , edgeList1);
                }
            if(nextEdge === null){
                removeEdge(startingEdge , edgeList1);
                return [startingEdge];
            }
    
            if(checkArrayEquality(nextEdge[1] , targetPosition )){
                return [startingEdge , nextEdge];
            } 
            
            if( nextEdge !== null){
                return [ startingEdge , ...step(nextEdge)];
            }
        }
    
        path = step(initialEdge);
        if(checkArrayEquality(path[path.length - 1][1] , targetPosition )){
            break parentLoop;
        }
    }

    if(path === undefined) return getPath(edgeList1 , initialPositionPPS , targetPosition);
    if(checkArrayEquality(path[path.length - 1][1] , targetPosition)) return path;
    
    return getPath(edgeList1 , initialPositionPPS , targetPosition);
}

function knightMoves(initialPosition , targetPosition){

    edgeList1 = createEdgeList([initialPosition] , targetPosition);

    let initialPositionPPS = edgeList1.filter((element) => checkArrayEquality(element[0] , initialPosition));

    let ourPath = getPath(edgeList1 , initialPositionPPS , targetPosition);    

    return ourPath;
}

// only moves 2 or less than 2 works, if > 2 , call stack exceeds
// should create a class next time , will work on it after some time,
// for now, just glad that i am getting atleast the solution lol
// also understood the essence of keeping null at the end of the tree in bst
// so that we get a chance to end the search there, also understood why we create
// a node object to store the left, right and object-data, seems like a pita if i try
// that for this, imagine having 8 attributes pointing to a node containing 8 nodes LMAOOOOO
// or maybe i should try it seriously hmm...
console.log(knightMoves([3,3] , [6,6]));