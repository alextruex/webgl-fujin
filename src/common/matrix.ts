function m3Multiply(a:Array<number>,b:Array<number>){
    let a00 = a[0 * 3 + 0];
    let a01 = a[0 * 3 + 1];
    let a02 = a[0 * 3 + 2];
    let a10 = a[1 * 3 + 0];
    let a11 = a[1 * 3 + 1];
    let a12 = a[1 * 3 + 2];
    let a20 = a[2 * 3 + 0];
    let a21 = a[2 * 3 + 1];
    let a22 = a[2 * 3 + 2];
    let b00 = b[0 * 3 + 0];
    let b01 = b[0 * 3 + 1];
    let b02 = b[0 * 3 + 2];
    let b10 = b[1 * 3 + 0];
    let b11 = b[1 * 3 + 1];
    let b12 = b[1 * 3 + 2];
    let b20 = b[2 * 3 + 0];
    let b21 = b[2 * 3 + 1];
    let b22 = b[2 * 3 + 2];
 
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
}

function m4Multiply(a:Array<number>,b:Array<number>){
  let b00 = b[0 * 4 + 0];
  let b01 = b[0 * 4 + 1];
  let b02 = b[0 * 4 + 2];
  let b03 = b[0 * 4 + 3];
  let b10 = b[1 * 4 + 0];
  let b11 = b[1 * 4 + 1];
  let b12 = b[1 * 4 + 2];
  let b13 = b[1 * 4 + 3];
  let b20 = b[2 * 4 + 0];
  let b21 = b[2 * 4 + 1];
  let b22 = b[2 * 4 + 2];
  let b23 = b[2 * 4 + 3];
  let b30 = b[3 * 4 + 0];
  let b31 = b[3 * 4 + 1];
  let b32 = b[3 * 4 + 2];
  let b33 = b[3 * 4 + 3];
  let a00 = a[0 * 4 + 0];
  let a01 = a[0 * 4 + 1];
  let a02 = a[0 * 4 + 2];
  let a03 = a[0 * 4 + 3];
  let a10 = a[1 * 4 + 0];
  let a11 = a[1 * 4 + 1];
  let a12 = a[1 * 4 + 2];
  let a13 = a[1 * 4 + 3];
  let a20 = a[2 * 4 + 0];
  let a21 = a[2 * 4 + 1];
  let a22 = a[2 * 4 + 2];
  let a23 = a[2 * 4 + 3];
  let a30 = a[3 * 4 + 0];
  let a31 = a[3 * 4 + 1];
  let a32 = a[3 * 4 + 2];
  let a33 = a[3 * 4 + 3];

  return [
    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
  ];
}

export {m3Multiply, m4Multiply};