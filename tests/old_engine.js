
//starting engfine 3d

var util = new function() {
	this.getPoint = function(vertex,cam) {
		var vx = vertex.x - cam.x;
		var vy = vertex.y - cam.y;
		var vz = vertex.z - cam.z;
		
		var vxY = Math.cos(cam.rotationY)*vx + Math.sin(cam.rotationY)*vz;
		var vyY = vy;
		var vzY = Math.cos(cam.rotationY)*vz - Math.sin(cam.rotationY)*vx;
		
		var vxX = vxY;
		var vyX = Math.cos(cam.rotationX)*vyY - Math.sin(cam.rotationX)*vzY;
		var vzX = Math.cos(cam.rotationX)*vzY + Math.sin(cam.rotationX)*vyY;
		
		var vxZ = Math.cos(cam.rotationZ)*vxX + Math.sin(cam.rotationZ)*vyX;
		var vyZ = Math.cos(cam.rotationZ)*vyX - Math.sin(cam.rotationZ)*vxX;
		var vzZ = vzX;
		
		var trans = new Vertex(vxZ,vyZ,vzZ);
		
		var scale = cam.depth/vzZ;
		
		var point = new Point((vxZ*scale) + cam.offsetX, (vyZ*scale) + cam.offsetY, vzZ, vertex.index, trans);
		
		return point;
	};
	
	this.transpose = function(obj) {
		for (var a in obj.original) {
			var vx = obj.original[a].x + obj.x;
			var vy = obj.original[a].y + obj.y;
			var vz = obj.original[a].z + obj.z;
			var vt = new Vertex(vx, vy, vz);
			obj.vertex[a] = this.rotate(obj, vt);
		}
		obj.update();
	};
	
	this.rotate = function(center, vertex) {
		var vx = vertex.x;// - center.x;
		var vy = vertex.y;// - center.y;
		var vz = vertex.z;// - center.z;
		
		var vxY = Math.cos(util.radian(center.rotationY))*vx + Math.sin(util.radian(center.rotationY))*vz;
		var vyY = vy;
		var vzY = Math.cos(util.radian(center.rotationY))*vz - Math.sin(util.radian(center.rotationY))*vx;
		
		var vxX = vxY;
		var vyX = Math.cos(util.radian(center.rotationX))*vyY - Math.sin(util.radian(center.rotationX))*vzY;
		var vzX = Math.cos(util.radian(center.rotationX))*vzY + Math.sin(util.radian(center.rotationX))*vyY;
		
		var vxZ = Math.cos(util.radian(center.rotationZ))*vxX + Math.sin(util.radian(center.rotationZ))*vyX;
		var vyZ = Math.cos(util.radian(center.rotationZ))*vyX - Math.sin(util.radian(center.rotationZ))*vxX;
		var vzZ = vzX;
		
		return new Vertex(vxZ, vyZ, vzZ);
	};
	
	this.tracer = null;
	this.tmp = null;
	
	this.trace = function(message) {
		if (this.tracer == null) {
			this.tracer = document.getElementById("tracer");
		}
		this.tracer.innerHTML += "- " + message + "<br />";
		this.tracer.scrollTop = this.tracer.scrollHeight;
	};
	
	this.radian = function(value) {
		return (value*Math.PI/180);
	};
	
	this.degree = function(value) {
		return (value*180/Math.PI);
	};
	
	this.loadFile = function(file, callback) {
		var reader = new FileReader();
		reader.onload = callback;
		reader.readAsText(file);
	};
	
	this.parseOBJ = function(file, scn, ca, co) {
		var ob = "ini";
		this.loadFile(file, function(e) {
			
			ob = e.target.result;
			var va = ob.split("\nv ");
			va[va.length-1] = va[va.length-1].split("\n")[0];
			va = va.slice(1,va.length);
			var fa = ob.split("\nf ");
			fa[fa.length-1] = fa[fa.length-1].split("\n")[0];
			fa = fa.slice(1,fa.length);
			for (var a in va) {
				var _va = va[a].split(" ");
				va[a] = new Vertex(_va[0], _va[1]*-1, _va[2]);
			}
			for (var b in fa) {
				var _fa = fa[b].split(" ");
				var v1 = va[_fa[0].split("/")[0]-1];
				var v2 = va[_fa[1].split("/")[0]-1];
				var v3 = va[_fa[2].split("/")[0]-1];
				fa[b] = new Face(v1,v2,v3, "rgb(42, 42, 42);");
				
			}
			var ras = {x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, base: va.slice(), vertex: va.slice(), lines: [], faces: fa.slice(), points: []};
			scn.clear();
			scn.addObject(ras);
		});
	};
}

//cube structure

function Vertex (x,y,z,index) {
	if (x == null) {
		x = 0;
	}
	if (y == null) {
		y = 0;
	}
	if (z == null) {
		z = 0;
	}
	
    this.x = x;
    this.y = y;
    this.z = z;
    
   if (index == null) {
    	index = 0;
    }
    
    this.index = index;
    
    this.getInfo = function() {
        return 'vertex at x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + '.';
    };
}

function Vector(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this._length = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)+Math.pow(this.z,2));
	
	this.getLength = function() {
		this._length = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)+Math.pow(this.z,2));
		return this._length;
	};
	
	this.add = function(vector) {
		this.x = this.x+vector.x;
		this.y = this.y+vector.y;
		this.z = this.z+vector.z;
	};
	
	this.sub = function(vector) {
		this.x = this.x-vector.x;
		this.y = this.y-vector.y;
		this.z = this.z-vector.z;
	};
	
	this.scale = function(value) {
		this.x = this.x*value;
		this.y = this.y*value;
		this.z = this.z*value;
	};
	
	this.dot = function(vector) {
		var dot = (this.x*vector.x)+(this.y*vector.y)+(this.z*vector.z);
		return dot;
	};
	
	this.cross = function(vector) {
		var cross = new Vector((this.y*vector.z)-(this.z*vector.y),
								(this.z*vector.x)-(this.x*vector.z),
								(this.x*vector.y)-(this.y*vector.x));
		return cross;
	};
	
	this.unit = function() {
		var ux = this.x/this.getLength();
		var uy = this.y/this.getLength();
		var uz = this.z/this.getLength();
		return new Vector(ux,uy,uz);
	};
	
	this.__defineGetter__("length", this.getLength);
}

function Line (vertex1,vertex2,first,index) {
	this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    
    this.x = (vertex1.x + vertex2.x)/2;
    this.y = (vertex1.y + vertex2.y)/2;
    this.z = (vertex1.z + vertex2.z)/2;
    
    if (index == null) {
    	index = 0;
    }
    
    this.index = index;
    
    this.getInfo = function() {
        return 'line segment at x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + '.';
    };
}

function Face (vertex1,vertex2,vertex3,color,index) {
	this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.vertex3 = vertex3;
    
    this.color = color;
    
    this.lines = [new Line(this.vertex1, this.vertex2), new Line(this.vertex2, this.vertex3), new Line(this.vertex3, this.vertex1)];
    
    this.x = (this.vertex1.x + this.vertex2.x + this.vertex3.x)/3;
    this.y = (this.vertex1.y + this.vertex2.y + this.vertex3.y)/3;
    this.z = (this.vertex1.z + this.vertex2.z + this.vertex3.z)/3;
    
    this.t1 = new Vertex(this.vertex2.x - this.vertex1.x, this.vertex2.y - this.vertex1.y, this.vertex2.z - this.vertex1.z);// ok
    this.t2 = new Vertex(this.vertex3.x - this.vertex2.x, this.vertex3.y - this.vertex2.y, this.vertex3.z - this.vertex2.z);// ok
    
    this.cross = new Vector();
    this.cross.x = (this.t1.y * this.t2.z) - (this.t1.z * this.t2.y);
    this.cross.y = (this.t1.z * this.t2.x) - (this.t1.x * this.t2.z);
    this.cross.z = (this.t1.x * this.t2.y) - (this.t1.y * this.t2.x);
    //this.n = this.cross.unit();
    
    this.normal = new Line(new Vertex(this.x, this.y, this.z),
    									this.cross);
    
    if (index == null) {
    	index = 0;
    }
    
    this.index = index;
    
    this.getInfo = function() {
        return 'triangle face at x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + '.';
    };
}

function Camera (width,height,depth) {
	if (width == null) {
		width = 640;
	}
	if (height == null) {
		height = 480;
	}
	if (depth == null) {
		depth = 350;
	}
	
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.offsetX = this.width / 2;
    this.offsetY = this.height / 2;
    //this.normal = 
    
    this.getInfo = function() {
        return 'camera.';
    };
}

function Scene (camera) {
	this.objects = [];
	this.lines = [];
	this.faces = [];
	
	this.addObject = function(object) {
		
		this.lines = this.lines.concat(object.lines);
		
		this.faces = this.faces.concat(object.faces);
		
		this.objects.push(object);
	};
	
	this.clear = function() {
		this.lines = [];
		
		this.faces = [];
		
		this.objects = [];
	};
	
	this.renderWire = function(context,camara) {
		context.fillStyle="rgb(255, 255, 255);";
        context.fillRect(0, 0, camara.width, camara.height);
        
        //util.trace("Frame cleared");
        
		context.beginPath();
		
		util.trace("Path started");
		
		for (a in this.lines) {
			
			//util.trace("Rendering a line");
			
			var p1 = util.getPoint(this.lines[a].vertex1,camara);
			
			//util.trace("Start point setted");
			
			var p2 = util.getPoint(this.lines[a].vertex2,camara);
			
			if (p1.depth > 0 && p2.depth > 0) {
			
				context.moveTo(p1.x, p1.y);
				context.lineTo(p2.x, p2.y);
			
			}
			
			//util.trace("Line rendered");
		}
		
		context.stroke();
		
		//util.trace("Strokes drawed");
	};
	
	this.renderPoly = function(context,camara) {
		var drawList = [];
		
		for (h in this.objects) {
			for (a in this.objects[h].faces) {
				var p1 = util.getPoint(this.objects[h].vertex[this.objects[h].faces[a].vertex1],camara);
				
				var p2 = util.getPoint(this.objects[h].vertex[this.objects[h].faces[a].vertex2],camara);
				
				var p3 = util.getPoint(this.objects[h].vertex[this.objects[h].faces[a].vertex3],camara);
				
				var center = new Vertex((p1.vertex.x+p2.vertex.x+p3.vertex.x)/3, (p1.vertex.y+p2.vertex.y+p3.vertex.y)/3, (p1.vertex.z+p2.vertex.z+p3.vertex.z)/3);
					
				var cax = p3.x - p1.x;
				var cay = p3.y - p1.y;
				var bcx = p2.x - p3.x;
				var bcy = p2.y - p3.y;
				
				var f1 = cax*bcy;
				var f2 = cay*bcx;
				
				var ff = f1 > f2;
				
				if (p1.depth > 0 && p2.depth > 0 && p3.depth > 0) {
					if (!ff) {
						drawList.push({pt1: p1, pt2: p2, pt3: p3, zb: center.z, col: this.objects[h].faces[a].color});
					}
				}
				
			}
		}
		
		/*
		for (h in this.objects) {
			for (a in this.objects[h].faces) {
				var p1 = util.getPoint(this.objects[h].faces[a].vertex1,camara);
				
				var p2 = util.getPoint(this.objects[h].faces[a].vertex2,camara);
				
				var p3 = util.getPoint(this.objects[h].faces[a].vertex3,camara);
				
				var center = new Vertex((p1.vertex.x+p2.vertex.x+p3.vertex.x)/3, (p1.vertex.y+p2.vertex.y+p3.vertex.y)/3, (p1.vertex.z+p2.vertex.z+p3.vertex.z)/3);
					
				var cax = p3.x - p1.x;
				var cay = p3.y - p1.y;
				var bcx = p2.x - p3.x;
				var bcy = p2.y - p3.y;
				
				var f1 = cax*bcy;
				var f2 = cay*bcx;
				
				var ff = f1 > f2;
				
				if (p1.depth > 0 && p2.depth > 0 && p3.depth > 0) {
					if (!ff) {
						drawList.push({pt1: p1, pt2: p2, pt3: p3, zb: center.z, col: this.objects[h].faces[a].color});
					}
				}
				
			}
		}
		*/
			
		drawList.sort(function(a, b) { return b.zb - a.zb; });
			
		//util.trace(drawList.length);
			
		context.fillStyle="rgb(255, 255, 255);";
		context.fillRect(0, 0, camara.width, camara.height);
		
		for (a in drawList) {
	       	
			context.beginPath();
		
			context.fillStyle=drawList[a].col;
			context.strokeStyle="rgb(255, 0, 0);"
			
			context.moveTo(drawList[a].pt1.x, drawList[a].pt1.y);
			context.lineTo(drawList[a].pt2.x, drawList[a].pt2.y);
			context.lineTo(drawList[a].pt3.x, drawList[a].pt3.y);
			context.lineTo(drawList[a].pt1.x, drawList[a].pt1.y);
			/*
			context.moveTo(drawList[a].nr1.x, drawList[a].nr1.y);
			context.lineTo(drawList[a].nr2.x, drawList[a].nr2.y);
			*/
			context.fill();
			context.stroke();
		}
	};
	
	this.getInfo = function() {
        return 'scene with ' + this.objects.length + ' objects, drawed with ' + this.lines.length + ' lines.';
    };
}

function Cube (size) {
	if (size == null) {
		size = 100;
	}
    this.size = size;
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._rotationX = 0;
    this._rotationY = 0;
    this._rotationZ = 0;
    
    this.faces = [];
    this.lines = [];
    
    this.original = [
	    new Vertex(-(size/2), (size/2), -(size/2), -1), 
	    new Vertex(-(size/2), -(size/2), -(size/2)), 
	    new Vertex((size/2), -(size/2), -(size/2)), 
	    new Vertex((size/2), (size/2), -(size/2)), 
	    new Vertex(-(size/2), -(size/2), (size/2)), 
	    new Vertex(-(size/2), (size/2), (size/2)), 
	    new Vertex((size/2), (size/2), (size/2)), 
	    new Vertex((size/2), -(size/2), (size/2), 1)
	];
    
    this.vertex = this.original.slice();
    
    this.update = function() {
    	
	    this.faces = [
	    	new Face(this.vertex[0], this.vertex[1], this.vertex[2], "rgb(21, 21, 21);", -1),
	    	new Face(this.vertex[2], this.vertex[3], this.vertex[0], "rgb(42, 42, 42);"),
	    	new Face(this.vertex[3], this.vertex[2], this.vertex[7], "rgb(63, 63, 63);"),
	    	new Face(this.vertex[7], this.vertex[6], this.vertex[3], "rgb(84, 84, 84);"),
	    	new Face(this.vertex[6], this.vertex[7], this.vertex[4], "rgb(105, 105, 105);"),
	    	new Face(this.vertex[4], this.vertex[5], this.vertex[6], "rgb(126, 126, 126);"),
	    	new Face(this.vertex[5], this.vertex[4], this.vertex[1], "rgb(147, 147, 147);"),
	    	new Face(this.vertex[1], this.vertex[0], this.vertex[5], "rgb(168, 168, 168);"),
	    	new Face(this.vertex[5], this.vertex[0], this.vertex[3], "rgb(189, 189, 189);"),
	    	new Face(this.vertex[3], this.vertex[6], this.vertex[5], "rgb(210, 210, 210);"),
	    	new Face(this.vertex[1], this.vertex[4], this.vertex[7], "rgb(231, 231, 231);"),
	    	new Face(this.vertex[7], this.vertex[2], this.vertex[1], "rgb(252, 252, 252);", 1)
	    ];
	    
	    this.lines = [
	    	new Line(this.vertex[0], this.vertex[3], "rgb(14, 14, 14);", -1),
	    	new Line(this.vertex[0], this.vertex[1], "rgb(28, 28, 28);"),
	    	new Line(this.vertex[1], this.vertex[2], "rgb(42, 42, 42);"),
	    	new Line(this.vertex[2], this.vertex[3], "rgb(56, 56, 56);"),
	    	new Line(this.vertex[0], this.vertex[2], "rgb(70, 70, 70);"),
	    	new Line(this.vertex[1], this.vertex[5], "rgb(84, 84, 84);"),
	    	new Line(this.vertex[5], this.vertex[6], "rgb(98, 98, 98);"),
	    	new Line(this.vertex[6], this.vertex[2], "rgb(112, 112, 112);"),
	    	new Line(this.vertex[1], this.vertex[6], "rgb(126, 126, 126);"),
	    	new Line(this.vertex[5], this.vertex[4], "rgb(140, 140, 140);"),
	    	new Line(this.vertex[4], this.vertex[7], "rgb(154, 154, 154);"),
	    	new Line(this.vertex[7], this.vertex[6], "rgb(168, 168, 168);"),
	    	new Line(this.vertex[5], this.vertex[7], "rgb(182, 182, 182);"),
	    	new Line(this.vertex[4], this.vertex[0], "rgb(196, 196, 196);"),
	    	new Line(this.vertex[3], this.vertex[7], "rgb(210, 210, 210);"),
	    	new Line(this.vertex[4], this.vertex[3], "rgb(224, 224, 224);"),
	    	new Line(this.vertex[4], this.vertex[1], "rgb(238, 238, 238);"),
	    	new Line(this.vertex[6], this.vertex[3], "rgb(252, 252, 252);", 1)
	    ];
	};
    
    this.setX = function(value) {
    	this._x = value;
    	
    	util.transpose(this);
    };
    
    this.getX = function() {
    	return this._x;
    };
    
    this.setY = function(value) {
    	this._y = value;
    	
    	util.transpose(this);
    };
    
    this.getY = function() {
    	return this._y;
    };
    
    this.setZ = function(value) {
    	this._z = value;
    	
    	util.transpose(this);
    };
    
    this.getZ = function() {
    	return this._z;
    };
    
    this.setRotationX = function(value) {
    	this._rotationX = value;
    	
    	util.transpose(this);
    };
    
    this.getRotationX = function() {
    	return this._rotationX;
    };
    
    this.setRotationY = function(value) {
    	this._rotationY = value;
    	
    	util.transpose(this);
    };
    
    this.getRotationY = function() {
    	return this._rotationY;
    };
    
    this.setRotationZ = function(value) {
    	this._rotationZ = value;
    	
    	util.transpose(this);
    };
    
    this.getRotationZ = function() {
    	return this._rotationZ;
    };
    
    this.getInfo = function() {
        return this.size + 'pts sized cube, at x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + '.';
    };
    
    this.__defineGetter__("x", this.getX);
    this.__defineSetter__("x", this.setX);
    this.__defineGetter__("y", this.getY);
    this.__defineSetter__("y", this.setY);
    this.__defineGetter__("z", this.getZ);
    this.__defineSetter__("z", this.setZ);
    
    this.__defineGetter__("rotationX", this.getRotationX);
    this.__defineSetter__("rotationX", this.setRotationX);
    this.__defineGetter__("rotationY", this.getRotationY);
    this.__defineSetter__("rotationY", this.setRotationY);
    this.__defineGetter__("rotationZ", this.getRotationZ);
    this.__defineSetter__("rotationZ", this.setRotationZ);
    
    this.update();
    util.transpose(this);
}

function Mesh (verts,fases,lins) {
	if (size == null) {
		size = 100;
	}
    this.size = size;
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._rotationX = 0;
    this._rotationY = 0;
    this._rotationZ = 0;
    
    this.original = [];
    this.faces = [];
    this.lines = [];
    
    
    this.vertex = this.original.slice();
    
    this.update = function() {
    	
	    this.faces = [
	    	new Face(this.vertex[0], this.vertex[1], this.vertex[2], "rgb(21, 21, 21);", -1),
	    	new Face(this.vertex[2], this.vertex[3], this.vertex[0], "rgb(42, 42, 42);"),
	    	new Face(this.vertex[3], this.vertex[2], this.vertex[7], "rgb(63, 63, 63);"),
	    	new Face(this.vertex[7], this.vertex[6], this.vertex[3], "rgb(84, 84, 84);"),
	    	new Face(this.vertex[6], this.vertex[7], this.vertex[4], "rgb(105, 105, 105);"),
	    	new Face(this.vertex[4], this.vertex[5], this.vertex[6], "rgb(126, 126, 126);"),
	    	new Face(this.vertex[5], this.vertex[4], this.vertex[1], "rgb(147, 147, 147);"),
	    	new Face(this.vertex[1], this.vertex[0], this.vertex[5], "rgb(168, 168, 168);"),
	    	new Face(this.vertex[5], this.vertex[0], this.vertex[3], "rgb(189, 189, 189);"),
	    	new Face(this.vertex[3], this.vertex[6], this.vertex[5], "rgb(210, 210, 210);"),
	    	new Face(this.vertex[1], this.vertex[4], this.vertex[7], "rgb(231, 231, 231);"),
	    	new Face(this.vertex[7], this.vertex[2], this.vertex[1], "rgb(252, 252, 252);", 1)
	    ];
	    
	    this.lines = [
	    	new Line(this.vertex[0], this.vertex[3], "rgb(14, 14, 14);", -1),
	    	new Line(this.vertex[0], this.vertex[1], "rgb(28, 28, 28);"),
	    	new Line(this.vertex[1], this.vertex[2], "rgb(42, 42, 42);"),
	    	new Line(this.vertex[2], this.vertex[3], "rgb(56, 56, 56);"),
	    	new Line(this.vertex[0], this.vertex[2], "rgb(70, 70, 70);"),
	    	new Line(this.vertex[1], this.vertex[5], "rgb(84, 84, 84);"),
	    	new Line(this.vertex[5], this.vertex[6], "rgb(98, 98, 98);"),
	    	new Line(this.vertex[6], this.vertex[2], "rgb(112, 112, 112);"),
	    	new Line(this.vertex[1], this.vertex[6], "rgb(126, 126, 126);"),
	    	new Line(this.vertex[5], this.vertex[4], "rgb(140, 140, 140);"),
	    	new Line(this.vertex[4], this.vertex[7], "rgb(154, 154, 154);"),
	    	new Line(this.vertex[7], this.vertex[6], "rgb(168, 168, 168);"),
	    	new Line(this.vertex[5], this.vertex[7], "rgb(182, 182, 182);"),
	    	new Line(this.vertex[4], this.vertex[0], "rgb(196, 196, 196);"),
	    	new Line(this.vertex[3], this.vertex[7], "rgb(210, 210, 210);"),
	    	new Line(this.vertex[4], this.vertex[3], "rgb(224, 224, 224);"),
	    	new Line(this.vertex[4], this.vertex[1], "rgb(238, 238, 238);"),
	    	new Line(this.vertex[6], this.vertex[3], "rgb(252, 252, 252);", 1)
	    ];
	};
    
    this.setX = function(value) {
    	this._x = value;
    	
    	util.transpose(this);
    };
    
    this.getX = function() {
    	return this._x;
    };
    
    this.setY = function(value) {
    	this._y = value;
    	
    	util.transpose(this);
    };
    
    this.getY = function() {
    	return this._y;
    };
    
    this.setZ = function(value) {
    	this._z = value;
    	
    	util.transpose(this);
    };
    
    this.getZ = function() {
    	return this._z;
    };
    
    this.setRotationX = function(value) {
    	this._rotationX = value;
    	
    	util.transpose(this);
    };
    
    this.getRotationX = function() {
    	return this._rotationX;
    };
    
    this.setRotationY = function(value) {
    	this._rotationY = value;
    	
    	util.transpose(this);
    };
    
    this.getRotationY = function() {
    	return this._rotationY;
    };
    
    this.setRotationZ = function(value) {
    	this._rotationZ = value;
    	
    	util.transpose(this);
    };
    
    this.getRotationZ = function() {
    	return this._rotationZ;
    };
    
    this.getInfo = function() {
        return this.size + 'pts sized cube, at x: ' + this.x + ', y: ' + this.y + ', z: ' + this.z + '.';
    };
    
    this.__defineGetter__("x", this.getX);
    this.__defineSetter__("x", this.setX);
    this.__defineGetter__("y", this.getY);
    this.__defineSetter__("y", this.setY);
    this.__defineGetter__("z", this.getZ);
    this.__defineSetter__("z", this.setZ);
    
    this.__defineGetter__("rotationX", this.getRotationX);
    this.__defineSetter__("rotationX", this.setRotationX);
    this.__defineGetter__("rotationY", this.getRotationY);
    this.__defineSetter__("rotationY", this.setRotationY);
    this.__defineGetter__("rotationZ", this.getRotationZ);
    this.__defineSetter__("rotationZ", this.setRotationZ);
    
    this.update();
    util.transpose(this);
}

function Point(x,y,depth,index,vertex) {
	this.x = x;
	this.y = y;
	this.depth = depth;
	this.index = index;
	this.vertex = vertex;
	
	this.getInfo = function() {
        return 'point at x: ' + this.x + ', y: ' + this.y + '.';
    };
}
