var canvas, context, cam, scene, angle, allFiles, test;
			
			function onInit() {
				canvas = document.getElementById('elCanvas');
   				context = canvas.getContext('2d');
   				
   				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
   				
   				cam = new Camera(canvas.width,canvas.height,350);
   				
   				cam.y = -400;
   				cam.x = 0;
   				cam.z = 0;
   				
   				cam.rotationX = util.radian(20);
   				cam.rotationY = util.radian(180);
   				
   				scene = new Scene(cam);
   				
   				/*
   				var map = [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]];
   				
   				for (var a=0;a<5;a++) {
   					for (var b=0;b<5;b++) {
   						if (map[a][b] == 1) {
   							var cube = new Cube(100);
   							cube.x = (100*a)-250;
   							cube.z = (100*b)-250;
   							scene.addObject(cube);
   						}
   					}
   				}
   				*/
   				
   				/*
   				var tri = {x: 0, y: 0, z: 0, vertex: new Array(), lines: new Array(), faces: new Array()};
   				tri.vertex.push(new Vertex(0,0,0));
   				tri.vertex.push(new Vertex(-75,0,0));
   				tri.vertex.push(new Vertex(-75,75,0));
   				
   				tri.lines.push(new Line(tri.vertex[0], tri.vertex[1]));
   				tri.lines.push(new Line(tri.vertex[1], tri.vertex[2]));
   				tri.lines.push(new Line(tri.vertex[2], tri.vertex[0]));
   				
   				tri.faces.push(new Face(tri.vertex[2], tri.vertex[1], tri.vertex[0]));
   				
   				scene.addObject(tri);
   				*/
   				
   				/**/
   				var cube1 = new Cube(100);
   				scene.addObject(cube1);
   				cube1.rotationX = 0;
   				cube1.rotationY = 0;
   				cube1.rotationZ = 0;
   				cube1.x = 0;
   				cube1.y = 0;
   				cube1.z = 0;
   				
   				var disp = 0;
   				
   				for (var m=0;m<50;m++) {
   					cube1 = new Cube(100);
   					var cp = m%4;
   					switch (cp) {
   						case 0 :
   							disp += 100;
   							cube1.x = disp;
   							break;
   						case 1 :
   							cube1.z = disp;
   							break;
   						case 2 :
   							cube1.x = -disp;
   							break;
   						case 3 :
   							cube1.z = -disp;
   							break;
   					}
	   				scene.addObject(cube1);
   				}
   				
   				canvas.addEventListener("mousemove", camRot, false);
   				window.addEventListener("keydown", camMove, false);
   				
   				angle = util.radian(0);
   				
   				var dropZone = document.getElementById('drop');
				dropZone.addEventListener('dragover', handleDragOver, false);
				dropZone.addEventListener('drop', handleFileSelect, false);
   				
   				setInterval(interact, 33);
   				
			}
			
			function handleFileSelect(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				
				var files = evt.dataTransfer.files; // FileList object.
			
			    // files is a FileList of File objects. List some properties.
			    allFiles = [];
			    for (var i = 0, f; f = files[i]; i++) {
			    	allFiles.push(f);
			    }
			    util.parseOBJ(allFiles[0], scene, cam, context);
			    util.trace(test.faces);
			    //scene.addObject(test);
			}
			  
			function handleDragOver(evt) {
			    evt.stopPropagation();
			    evt.preventDefault();
			    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
			}
			
			function camRot(e) {
				var mouseX, mouseY;

			    if(e.offsetX) {
			        mouseX = e.offsetX;
			        mouseY = e.offsetY;
			    }else if(e.layerX) {
			        mouseX = e.layerX;
			        mouseY = e.layerY;
			    }
			    
			    mouseX = mouseX + (cam.width/2);
			    mouseY = mouseY + (cam.height/2);
			    
			    cam.rotationY += (((mouseX/cam.width)*-6.3)-cam.rotationY)/10;
			    cam.rotationX += (((mouseY/cam.height)*6.3)-cam.rotationX)/10;
			}
			
			function camMove(e) {
				var cc = e.keyCode;
				switch (cc) {
					case 65 :
					case 37 :
						cam.x -= 10;
						//util.trace('cam left');
						break;
					case 87 :
					case 38 :
						cam.z += 10;
						//util.trace('cam front');
						break;
					case 68 :
					case 39 :
						cam.x += 10;
						//util.trace('cam right');
						break;
					case 83 :
					case 40 :
						camz.z -= 10;
						//util.trace('cam back');
						break;
					default :
						//util.trace(cc);
						break;
				};
			}
			
			function interact() {
				
				//render function
				
				scene.renderPoly(context, cam, (document.getElementById("blur").value/1000)*1);
			}
			
			function animate() {
			    
			    var mid = 1;
                var mod = 0.5;
			    
				//camera circular motion around a point
				
				var origin = {x: 0, z: 0};
				var size = 200;
				
				
				var cube = scene.objects[0];
				
				if (cube.y >= 500) {
					if (mod<0) {
						mod = mod*1;
					}else {
						mod = mod*-1;
					}
				}else if (cube.y <= -500) {
					if (mod<0) {
						mod = mod*-1;
					}else {
						mod = mod*1;
					}
				}
				
				mid = (mod-cube.y)/500;
				
				if (mid>0 && mid<1) {
					mid = 1;
				}else if (mid<0 && mid>-1) {
					mid = -1;
				}
				cube.y += mid;
				
				for (p in scene.objects) {
					scene.objects[p].rotationX = (scene.objects[p].z/500)*-40;
					scene.objects[p].rotationZ = (scene.objects[p].x/500)*-40;
					if (p>0) {
						var ap = (p-1)%4;
						//util.trace(p-ap);
						scene.objects[p].y = scene.objects[(p-ap)-1].y/0.5;
					}
				}
				
				
				cam.x = origin.x + Math.sin(util.radian(angle))*size;
				cam.z = origin.z + Math.cos(util.radian(angle))*size;
				
				angle -= 1;
				cam.rotationY += util.radian(1);
				
				//render function
				//scene.renderWire(context, cam);
				scene.renderPoly(context, cam, (document.getElementById("blur").value/1000)*1);
			}