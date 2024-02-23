let pixelsStored = 1;
class Quadtree {
  constructor(xMin, xMax, yMin, yMax, value, depth=0) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.children = [];
    this.value = value;
    this.depth = depth;
  }
  query(x,y) {
    if (this.value !== -1) {return [this.value,this.depth]}
    if (x > (this.xMin+this.xMax)/2) {
      if (y > (this.yMin+this.yMax)/2) {
        return this.children[3].query(x,y)
      }
      return this.children[1].query(x,y)
    } else {
      if (y > (this.yMin+this.yMax)/2) {
        return this.children[2].query(x,y)
      }
      return this.children[0].query(x,y)
    }
  }
  update(x,y,next) {
    // alert(x+"|"+y+"|"+this.xMin+"|"+this.xMax+"|"+this.yMin+"|"+this.yMax);
    if (this.xMin==this.xMax) {this.value = next;return true;}
    if (this.value !== -1) {
      const xMid = Math.floor((this.xMin+this.xMax)/2);
      const yMid = Math.floor((this.yMin+this.yMax)/2);
      pixelsStored += 3;
      this.children.push(new Quadtree(this.xMin,xMid,this.yMin,yMid,this.value,this.depth+1));
      this.children.push(new Quadtree(xMid+1,this.xMax,this.yMin,yMid,this.value,this.depth+1));
      this.children.push(new Quadtree(this.xMin,xMid,yMid+1,this.yMax,this.value,this.depth+1));
      this.children.push(new Quadtree(xMid+1,this.xMax,yMid+1,this.yMax,this.value,this.depth+1));
      this.value = -1;
      if (x > xMid) {
        if (y > yMid) {
          this.children[3].update(x,y,next)
        }
        else {this.children[1].update(x,y,next)}
      } else {
        if (y > yMid) {
          this.children[2].update(x,y,next)
        }
        else {this.children[0].update(x,y,next)}
      }
      
    }
    else {
      const xMid = Math.floor((this.xMin+this.xMax)/2);
      const yMid = Math.floor((this.yMin+this.yMax)/2);
      if (x > xMid) {
        if (y > yMid) {
          this.children[3].update(x,y,next)
        }
        else {this.children[1].update(x,y,next)}
      } else {
        if (y > yMid) {
          this.children[2].update(x,y,next)
        }
        else {this.children[0].update(x,y,next)}
      }
      if ((this.children[0].value !== -1) && (this.children[0].value == this.children[1].value) && (this.children[2].value == this.children[3].value) && (this.children[2].value == this.children[1].value)) {
        pixelsStored -= 3;
        this.value = this.children[0].value;
        this.children = [];
      }
    }
  }
  change(x,y,next) {
    if (this.query(x,y)[0] == next || x<this.xMin || x>this.xMax || y<this.yMin || y>this.yMax) {return;}
    this.update(x,y,next);
  }
}
