var sketch=angular.module('sketch',[]);
sketch.controller('sketchController', ['$scope', function($scope){


	var canvas=document.querySelector('#canvas');
	var ctx=canvas.getContext('2d');
	var current;
 	$scope.canvasWH={width:1000,height:600};
	$scope.tool='line';
	$scope.tools={
				'画线工具':'line',
				'画圆工具':'arc',
				'矩形工具':'rect',
				'铅笔工具':'pen',
				'橡皮工具':'erase'
				 
 			 };

	$scope.settool=function(i){
		$scope.tool=i;
		//console.log($scope.tool);
 	}
	var saveCurrentImage=function(){
		current=ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height);//相当于 截图
	}

 
	$scope.csState={
		fillStyle:'#000000',
		strokeStyle:'#000000',
		lineWidth:'1',
		style:'stroke'
 	}

	$scope.setStyle=function(s){
		$scope.csState.style=s;
	}
	$scope.save=function(ev){
		//console.log(ev);
		if(current){
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download='picture.png';
		}else{
			alert("没有东西，确定要保存么？")
		}
		
 	}
 	$scope.newSketch=function(){
 		if(current){
 			if(confirm('是否保存')){
 				location.href=canvas.toDataURL()
 			} 
			clearcanvas();
			current=null;
  		}

 		
 	}



 	//    清除画布
	var clearcanvas=function(){
		ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
	}
	var setmousemove={
		line:function(e){
			canvas.onmousemove=function(ev){
				clearcanvas();
	 			if(current){
					ctx.putImageData(current,0,0);
				}
	 			ctx.beginPath();
				ctx.moveTo(e.offsetX,e.offsetY);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke(); 
	 		}
	 	},
	 	pen:function(e){
	 		ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
			canvas.onmousemove=function(ev){
				clearcanvas();
	 			if(current){
					ctx.putImageData(current,0,0);
				}
	 			
				ctx.lineTo(ev.offsetX-0.5,ev.offsetY-0.5);
				ctx.stroke(); 
	 		}
	 	},
	 	erase:function(e){
			canvas.onmousemove=function(ev){
				clearcanvas();
	 			if(current){
					ctx.putImageData(current,0,0);
				}
	 			ctx.beginPath();
				ctx.moveTo(e.offsetX,e.offsetY);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke(); 
	 		}
	 	},

	 	arc:function(e){
			canvas.onmousemove=function(ev){
				clearcanvas();
	 			if(current){
					ctx.putImageData(current,0,0);
				}
	 			ctx.beginPath();
				var r=Math.abs(ev.offsetX-e.offsetX);
	  			ctx.arc(e.offsetX-0.5,e.offsetY-0.5,r,0,Math.PI*2);
	  			if($scope.csState.style=='fill'){
	  				ctx.fill();
	  			}else{
	  				ctx.stroke(); 
	  			}
	  			
	 		}
	 	},
	 	rect:function(e){
			canvas.onmousemove=function(ev){
				clearcanvas();
	 			if(current){
					ctx.putImageData(current,0,0);
				}
	 			var w=ev.offsetX-e.offsetX;
				var h=ev.offsetY-e.offsetY;
				if($scope.csState.style=='fill'){
	   				ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
 				}else{
 					ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
 				}
	   			
	 		}
	 	},
	 	erase:function(e){
			canvas.onmousemove=function(ev){
			 
	 			var w=20;
				var h=20;
 	   			ctx.clearRect(ev.offsetX,ev.offsetY,w,h)
	 		}
	 	},
	 	 

 	}
 	//划线
	canvas.onmousedown=function(e){
		ctx.strokeStyle=$scope.csState.strokeStyle;
		ctx.fillStyle=$scope.csState.fillStyle;
		ctx.lineWidth=$scope.csState.lineWidth;
		setmousemove[$scope.tool](e); 
  		document.onmouseup=function(){
			canvas.onmousemove=null;
			canvas.onmouseup=null;
			saveCurrentImage();
			
		}
	}
	
}])