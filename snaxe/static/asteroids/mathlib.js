/**
 * Game Math class library, utility functions and constants.
 * 
 * (C) 2010 Kevin Roast kevtoast@yahoo.com @kevinroast
 * 
 * Please see: license.txt
 * You are welcome to use this code, but I would appreciate an email or tweet
 * if you do anything interesting with it!
 */

var RAD = Math.PI/180.0;
var TWOPI = Math.PI*2;


/**
 * Return a random integer value between low and high values
 */
function randomInt(low, high)
{
   return Math.floor(Math.random() * (high - low + 1) + low);
}


/**
 * Calculate normal vector.
 * 
 * First calculate vectors from 3 points on the poly:
 * Vector 1 = Vertex B - Vertex A
 * Vector 2 = Vertex C - Vertex A
 */
function calcNormalVector(x1, y1, z1, x2, y2, z2)
{
   return new Vector3D(
      (y1 * z2) - (z1 * y2),
      -((z2 * x1) - (x2 * z1)),
      (x1 * y2) - (y1 * x2) ).norm();
}


/**
 * Utility to set up the prototype, constructor and superclass properties to
 * support an inheritance strategy that can chain constructors and methods.
 * Static members will not be inherited.
 * 
 * @method extend
 * @static
 * @param {Function} subc   the object to modify
 * @param {Function} superc the object to inherit
 * @param {Object} overrides  additional properties/methods to add to the
 *                            subclass prototype.  These will override the
 *                            matching items obtained from the superclass.
 */
function extend(subc, superc, overrides)
{
   var F = function() {}, i;
   F.prototype = superc.prototype;
   subc.prototype = new F();
   subc.prototype.constructor = subc;
   subc.superclass = superc.prototype;
   if (superc.prototype.constructor == Object.prototype.constructor)
   {
      superc.prototype.constructor = superc;
   }
   
   if (overrides)
   {
      for (i in overrides)
      {
         if (overrides.hasOwnProperty(i))
         {
            subc.prototype[i] = overrides[i];
         }
      }
   }
}


function isArray(obj)
{
   return (obj.constructor.toString().indexOf("Array") !== -1);
}


/**
 * Vector (or Point) structure class - all fields are public.
 * 
 * @class Vector
 */
(function()
{
   Vector = function(x, y)
   {
      this.x = x;
      this.y = y;
      
      return this;
   };
   
   Vector.prototype =
   {
      /**
       * X coordinate
       *
       * @property x
       * @type number
       */
      x: 0,

      /**
       * Y coordinate
       *
       * @property y
       * @type number
       */
      y: 0,
      
      clone: function()
      {
         return new Vector(this.x, this.y);
      },
      
      set: function(v)
      {
         this.x = v.x;
         this.y = v.y;
         return this;
      },
      
      add: function(v)
      {
         this.x += v.x;
         this.y += v.y;
         return this;
      },
      
      sub: function(v)
      {
         this.x -= v.x;
         this.y -= v.y;
         return this;
      },
      
      dot: function(v)
      {
         return this.x * v.x + this.y * v.y;
      },
      
      length: function()
      {
         return Math.sqrt(this.x * this.x + this.y * this.y); 
      },
      
      distance: function(v)
      {
         var xx = this.x - v.x;
         var yy = this.y - v.y;
         return Math.sqrt(xx * xx + yy * yy); 
      },
      
      theta: function()
      {
         return Math.atan2(this.y, this.x);
      },
      
      thetaTo: function(vec)
      {
         // calc angle between the two vectors
         var v = this.clone().norm();
         var w = vec.clone().norm();
         return Math.acos(v.dot(w));
      },
      
      thetaTo2: function(vec)
      {
         return Math.atan2(vec.y, vec.x) - Math.atan2(this.y, this.x);
      },
      
      norm: function()
      {
         var len = this.length();
         this.x /= len;
         this.y /= len;
         return this;
      },
      
      rotate: function(a)
      {
      	var ca = Math.cos(a);
      	var sa = Math.sin(a);
      	with (this)
      	{
      		var rx = x*ca - y*sa;
      		var ry = x*sa + y*ca;
      		x = rx;
      		y = ry;
      	}
      	return this;
      },
      
      invert: function()
      {
         this.x = -this.x;
         this.y = -this.y;
         return this;
      },
      
      scale: function(s)
      {
         this.x *= s; 
         this.y *= s;
         return this;
      }
   };
})();


/**
 * Vector3D structure class - all fields are public.
 * 
 * @class Vector3D
 */
(function()
{
   Vector3D = function(x, y, z)
   {
      this.x = x;
      this.y = y;
      this.z = z;
      
      return this;
   };
   
   Vector3D.prototype =
   {
      /**
       * X coordinate
       *
       * @property x
       * @type number
       */
      x: 0,

      /**
       * Y coordinate
       *
       * @property y
       * @type number
       */
      y: 0,
      
      /**
       * Z coordinate
       *
       * @property z
       * @type number
       */
      z: 0,
      
      clone: function()
      {
         return new Vector3D(this.x, this.y, this.z);
      },
      
      set: function(v)
      {
         this.x = v.x;
         this.y = v.y;
         this.z = v.z;
         return this;
      },
      
      add: function(v)
      {
         this.x += v.x;
         this.y += v.y;
         this.z += v.z;
         return this;
      },
      
      sub: function(v)
      {
         this.x -= v.x;
         this.y -= v.y;
         this.z -= v.z;
         return this;
      },
      
      dot: function(v)
      {
         return this.x * v.x + this.y * v.y + this.z * v.z;
      },
      
      cross: function(v)
      {
         return new Vector3D(this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x);
      },
      
      length: function()
      {
         return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); 
      },
      
      distance: function(v)
      {
         var xx = this.x - v.x;
         var yy = this.y - v.y;
         var zz = this.z - v.z;
         return Math.sqrt(xx * xx + yy * yy + zz * zz); 
      },
      
      thetaTo: function(v)
      {
         // Expanded version of: Math.atan2(this.cross(v).length(), this.dot(v));
         // to avoid intermediate object creation (about 30% faster..!)
         
         // calculate cross product
         var x = this.y*v.z - this.z*v.y, 
             y = this.z*v.x - this.x*v.z,
             z = this.x*v.y - this.y*v.x;
         // atan2 of length of cross product with dot product of supplied vector
         return Math.atan2(Math.sqrt(x * x + y * y + z * z), this.dot(v));
      },
      
      norm: function()
      {
         var len = this.length();
         this.x /= len;
         this.y /= len;
         this.z /= len;
         return this;
      },
      
      scale: function(s)
      {
         this.x *= s; 
         this.y *= s;
         this.z *= s;
         return this;
      }
   };
})();