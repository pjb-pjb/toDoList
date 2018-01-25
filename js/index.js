let n=0;
$(function(){
	render();
	let myScroll=new IScroll(".box",{});
	let text=$(".open textarea");
	$(".open button").click(function(){
		let str=text.val();
		let time=new Date();
		if(str){
			let info=getData();
			info.push({text:str,time:getTime(time),isDone:false,isFlag:false});
			setData(info);
			render();
			text.val("");
			$(".open").fadeOut();	
			myScroll.refresh();
			myScroll.scrollTo(0,0,500);
		}else{
			alert("未输入！");
		}
	});
	$(".open1 button").click(function(){
		let data=getData();
		let index=$(document).data("id");
		data[index].text=$(this).prev().children().val();
		$(this).parent().fadeOut();
		setData(data);
		render();
	});
	$(".add").click(function(){
		$(".open").fadeIn();		
	});
	$("#isDone").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		n=1;		
		render();
	});
	$("#isPlan").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		n=0;
		render();
	});
	$(".close").click(function(){
		$(this).parent().fadeOut();
	});
//	$(".yuan li").click(function(a,b){
//		let index=$(this).index();
//		
//	});
	let time=setInterval(move,2000);
});
let h=0;
function move(){
	h++;
	if(h==6){
		$(".banner ul:not('.yuan')").animate({left:`0vw`},0);
		h=1;
	}
	if(h===5){
		$(".yuan li").eq(0).addClass("active").siblings().removeClass("active")
	}
	else{
		$(".yuan li").eq(h).addClass("active").siblings().removeClass("active")
	}
	$(".banner ul:not('.yuan')").animate({left:`${-h*100}vw`},200);
}
function getData(){
	return localStorage.info1?JSON.parse(localStorage.info1):[];
}
function setData(arr){
	localStorage.info1=JSON.stringify(arr);
}
function render(){
	let data=getData();
	let str="";
	$.each(data,function(index,val){
		if(data[index].isDone===false&&n===0){
			str+=`
				<li id=${index}>
					<p>${val.text}</p>
					<time>${val.time}&nbsp&nbsp<i class="icon flag ${data[index].isFlag==false?'':'active'}">&#xe63c;</i></time>
					<span class="isPlan">完成</span>
				</li>
			`;
		}
		if(data[index].isDone===true&&n==1){
			str+=`
				<li id=${index}>
					<p>${val.text}</p>
					<time>${val.time}&nbsp&nbsp<i class="icon flag ${data[index].isFlag==false?'':'active'}">&#xe63c;</i></time>
					<span class="isDone">删除</span>
				</li>
			`;
		}
	});
	$(".info").html(str);
	Huadong();
	flag();
}
function Huadong(){
	let x1,x2,movex;
	let pos=0;
	let max=$(".info span").outerWidth();
	$(".info li").each(function(index,ele){
		let list=new Hammer(ele);
		list.on("panstart",function(e){
			movex=0;
			$(ele).siblings().css("transform","translateX("+0+")");
			$(ele).css("transition","none");
			x1=e.center.x;
		})
		list.on("panmove",function(e){
			x2=e.center.x-x1;
			if(pos===0&&x2>0){
				return;
			}
			if(pos===1&&x2<0){
				return;
			}
			if(Math.abs(x2)>max){
				return;
			}
			if(pos===0){
				movex=x2;
			}else{
				movex=x2-max;
			}
			$(ele).css("transform","translateX("+movex+"px)");
		})
		list.on("panend",function(e){
			$(ele).css("transition","all .5s");
			if(Math.abs(movex)>max/2){
				$(ele).css("transform","translateX("+(-max)+"px)");
				pos=1;
			}else{
				$(ele).css("transform","translateX("+0+")");
				pos=0;
			}
		})
	});
}
function getTime(time){
	let year=time.getFullYear();
	let mouth=time.getMonth()+1;
	let day=time.getDate();
	let hour=time.getHours();
	let min=time.getMinutes();
	return `${year}-${mouth}-${day}`;
}
function flag(){
	let data=getData();
	$(".info li").on("click",".flag",function(e){
		let index=$(this).parent().parent().attr("id");
		data[index].isFlag=!data[index].isFlag;
		setData(data);
		render();
	}).on("click",".isPlan",function(){
		let index=$(this).parent().attr("id");
		data[index].isDone=true;
		setData(data);
		render();
		myScroll.refresh();
	}).on("click",".isDone",function(){
		let index=$(this).parent().attr("id");
		data.splice(index,1);
		setData(data);
		render();
		myScroll.refresh();
	}).on("click","p",function(){
		let index=$(this).parent().attr("id");
		$(document).data("id",index);
		let text=data[index].text;
		$(".open1").fadeIn().find("textarea").val(text);
	});
}
