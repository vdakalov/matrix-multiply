(function(){
    'use strict';

    var currentMatrix,
        matrixList = [
            {id: "A", selector: "#matrixA"},
            {id: "B", selector: "#matrixB"}
        ];

    function changeMatrix(matrix) {
        if (matrix.el.checked) {
            currentMatrix = matrix;
            alert("change" + matrix.id);
        }
    }

    // prepare matrix
    each(matrixList, function(matrix){
        matrix.el = document.querySelector(matrix.selector);
        bind(matrix.el, "change", changeMatrix.bind(this, matrix));
        if (matrix.el.checked) {
            changeMatrix(matrix);
        }
    });

}());