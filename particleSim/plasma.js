if (this.state == 8) {
      const canUp = (row>0 && interact(board[row-1][col],this));
      const canDown = (row<height-1 && interact(board[row+1][col],this));
      const canLeft = (col>0 && interact(board[row][col-1],this));
      const canRight = (col<width-1 && interact(board[row][col+1],this));
      const canUL = (canUp && canLeft && interact(board[row-1][col-1],this));
      const canUR = (canUp && canRight && interact(board[row-1][col+1],this));
      const canDR = (canDown && canRight && interact(board[row+1][col+1],this));
      const canDL = (canDown && canLeft && interact(board[row+1][col-1],this));
      var ups = 0;
      var downs = 0;
      var lefts = 0;
      var rights = 0;
      var uls = 0;
      var urs = 0;
      var drs = 0;
      var dls = 0;
      var current = 0;
      /*
       +++ 
      +   +
      +   +
      +   +
       +++ 
      */
      if (isPlasma(board[row-2],col)) {ups++;uls++;urs++;}
      if (isPlasma(board[row-2],col-1)) {ups++;uls++;}
      if (isPlasma(board[row-2],col+1)) {ups++;urs++;}
      if (isPlasma(board[row+2],col+1)) {downs++;drs++;}
      if (isPlasma(board[row+2],col-1)) {downs++;dls++;}
      if (isPlasma(board[row+2],col)) {downs++;dls++;drs++;}
      if (isPlasma(board[row],col-2)) {lefts++;dls++;uls++}
      if (isPlasma(board[row+1],col-2)) {lefts++;dls++}
      if (isPlasma(board[row-1],col-2)) {lefts++;uls++}
      if (isPlasma(board[row],col+2)) {rights++;urs++;drs++;}
      if (isPlasma(board[row+1],col+2)) {rights++;drs++;}
      if (isPlasma(board[row-1],col+2)) {rights++;urs++;}
      /*
       + 
      + +
       + 
      */
      if (isPlasma(board[row-1],col)) {lefts++;current++;rights++;uls++;urs++;}
      if (isPlasma(board[row],col+1)) {ups++;current++;downs++;urs++;drs++;}
      if (isPlasma(board[row+1],col)) {rights++;current++;lefts++;dls++;drs++;}
      if (isPlasma(board[row],col-1)) {ups++;current++;downs++;dls++;uls++}
      /*
      + +

      + +
      */
      if (isPlasma(board[row-1],col-1)) {lefts++;current++;ups++;}
      if (isPlasma(board[row-1],col+1)) {rights++;current++;ups++;}
      if (isPlasma(board[row+1],col+1)) {rights++;current++;downs++;}
      if (isPlasma(board[row+1],col-1)) {lefts++;current++;downs++;}
      /*
      +   +



      +   +
      */
      if (isPlasma(board[row-2],col-2)) {uls++;}
      if (isPlasma(board[row-2],col+2)) {urs++;}
      if (isPlasma(board[row+2],col+2)) {drs++;}
      if (isPlasma(board[row+2],col-2)) {dls++;}
      const the_biggest = Math.max(canDR?drs:0,canDL?dls:0,canUR?urs:0,canUL?uls:0,canUp?ups:0,canDown?downs:0,canRight?rights:0,canLeft?lefts:0,current);
      if (the_biggest == current) {return false;}
      //Diagonal movement
      if (the_biggest == urs) {board[row-1][col+1] = swap(board[row][col], board[row][col]=board[row-1][col+1]);return true;}
      if (the_biggest == uls) {board[row-1][col-1] = swap(board[row][col], board[row][col]=board[row-1][col-1]);return true;}
      if (the_biggest == drs) {board[row+1][col+1] = swap(board[row][col], board[row][col]=board[row+1][col+1]);return true;}
      if (the_biggest == dls) {board[row+1][col-1] = swap(board[row][col], board[row][col]=board[row+1][col-1]);return true;}
      //Orthogonal movement
      if (the_biggest == ups) {board[row-1][col] = swap(board[row][col], board[row][col]=board[row-1][col]);return true;}
      if (the_biggest == downs) {board[row+1][col] = swap(board[row][col], board[row][col]=board[row+1][col]);return true;}
      if (the_biggest == lefts) {board[row][col-1] = swap(board[row][col], board[row][col]=board[row][col-1]);return true;}
      if (the_biggest == rights) {board[row][col+1] = swap(board[row][col], board[row][col]=board[row][col+1]);return true;}
      
    }