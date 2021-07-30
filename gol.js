function Make2Darray(cols,rows,random){
	let arr= new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i]=new Array(rows);
		for (let j = 0; j < rows; j++) {
      if (random==true) {
			     arr[i][j] = randomIntFromInterval(0,5);
      }else
        arr[i][j] = 0;
      
		}
	}
	return arr;
}
//*************************************************
function checker(i,j,t,s){

  const male_or_female=  t==3 || t==2;
	//this function loop in neighbor cells and check for targeted cell  
	if(i==0 ||i== cols-1 ||j==0 ||j==rows-1){
        return false;
	}
	for (let l=j-1; l <= j+1; l+=s) {
    for (let k=i-1; k <= i+1; k+=s) {
		
      let leftneighbor=grid[k][l]==grid[i-1][j];
      let rightneighbor=grid[k][l]==grid[i+1][j];
      let topneighbor=grid[k][l]==grid[i][j+1];
      let bottomneighbor=grid[k][l]==grid[i][j-1];
      console.log({k,l});
      
			if(grid[k][l]==t){
        console.log("found at here %d %d",k,l);
        if((male_or_female)&&(leftneighbor||rightneighbor||topneighbor||bottomneighbor))
          continue;

        
				//storing the the cordenites of the cell traged (needed in child production)
        dec.i=k;
        dec.j=l;
				return true;    
			}
      // grid[k][l]=1;
      // redraw()		
        }

	}
  return false;
}


//*********************************************************
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//**********************************************************
function child_birth(x,y){
	if(randomIntFromInterval(1,0)==0){
        next[dec.i+x][dec.j]=1;
    }else{
   		next[dec.i][dec.j+y]=1;
    }
}
//****************************
function IsThereChild(x,y) {
  if(next[dec.i+x][dec.j]==1){
    return true;
  }
  else if(next[dec.i][dec.j+y]==1) {
    return true;
  }
}
//*****************************
/* t_i means the targeted partner i
   t_j means the targted partner j
*/
function partner_position_checker(i,j,t_i,t_j,action) {
  if(i-dec.i>0){
      if(j-dec.j>0){
         action(1,1);     
      } else {
            action(1,-1);
      }
    } else {
      if(j-dec.j>0){
        action(-1,-1);
      } else {
            action(-1,1);
    }

}
}
//*****************************
let value=1;
function mouseClicked(){
    try{
    let posX= Math.floor(mouseX/res);
    let posY=Math.floor(mouseY/res);
    //console.log(posX,posY);
    grid[posX][posY]= value%5;
    //console.log(grid[posX][posY]);
    value++;
    redraw();
    }
    catch{}
   





}

//*****************************
function logic(){
for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {

  //************checking if its a child***************

    if(grid[i][j]==1){

    // checking if it has any male/female neighbors
    console.log(checker(i,j,2,1));
    if(checker(i,j,2,1)||checker(i,j,3,1)){
     //child pass to the next genration
     next[i][j]=randomIntFromInterval(2,3);
    }
    else{
     //child dies
     next[i][j]=0;
    }
    }
    //***********check if its female************
    else if(grid[i][j]==2){
      //checking if its marid
      if (checker(i,j,2,2)) {
         const IsThereAChildbetweenthem= partner_position_checker(i,j,dec.i,dec.j,IsThereChild);
         if(IsThereAChildbetweenthem==true){
         next[i][j]=grid[i][j];//it servive to another genration because it has a child
         }
      }

      else{
        //if not marid it gets old
        next[i][j]=4;
      }




    }
    //************check if its male**************
    else if(grid[i][j]==3){
    //checking for mates
    if (checker(i,j,3,2)) {
    //new child
    //detecting the place of the mother and deciding the place of child acording to it 
    partner_position_checker(i,j,dec.i,dec.j,child_birth);
    
    // gets an extra genration
    next[i][j]=grid[i][j];
    }
    else {
    next[i][j]=4; }
    
    } 
    

    //***********check if its an old************
    else if(grid[i][j]==4){
    //checking for a male/female neighbors 
      if(checker(i,j,2,1)||checker(i,j,3,1)){
        //gets an extra genration
        next[i][j]=grid[i][j];
      }
      // else it dies
      else{
        next[i][j]=0;
      }
    }
    //**************************************
    
  
  
  }
 }
}
//*****************************

 function start_stop(){
  if(v_logic==true){
    v_logic=false;
   document.getElementById("start").value='start'
  }
  else{
     v_logic=true;
     document.getElementById("start").value='stop';
  }
 }
//*****************************
 function rest() {
    grid=Make2Darray(cols,rows,false);
    redraw();
 }
//*****************************
function Continue(){

  v_logic=true;
  redraw();
  v_logic=false;
  redraw();
}
//*****************************
var dec = {i:null,j:null};
let res=50,cols,rows,x,y ;
var grid,next;
var v_logic=false

function setup(){
createCanvas(600,350);
cols=width/res;
rows=height/res;
grid=Make2Darray(cols,rows,true);
noLoop();
}
function draw(){
 background(255, 255, 255);
 frameRate(30);
 for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      x=i*res;
      y=j*res;
      if(grid[i][j]==1){
      fill(255,165,0);
      }
      else if(grid[i][j]==2){ 
      fill(255, 255, 0);
      }
      else if(grid[i][j]==3){
      fill(255,0,0);
      }
      else if(grid[i][j]==4){
      fill(192,192,192);
      }
  
      else{
      fill(255);
      }
      rect(x,y,res,res);
    }
 }
 next =grid;
 
if (v_logic==true){
  logic();
 } 

 grid=next;
  
}



