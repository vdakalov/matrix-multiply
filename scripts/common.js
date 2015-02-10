(function(){
    'use strict';

    var workspace = document.querySelector(".workspace"),
        multiplyAction = document.querySelector("#action-multiply"),
        addRowAction = document.querySelector("#action-add-row"),
        delRowAction = document.querySelector("#action-del-row"),
        addColumnAction = document.querySelector("#action-add-column"),
        delColumnAction = document.querySelector("#action-del-column"),
        clearAction = document.querySelector("#action-clear"),
        exchangeAction = document.querySelector("#action-exchange"),

        currentMatrix,
        resultMatrix = document.querySelector("#result-matrix"),
        matrixList = [
            {id: "A", toggleSelector: "#toggle-matrixA", containerSelector: "#matrixA"},
            {id: "B", toggleSelector: "#toggle-matrixB", containerSelector: "#matrixB"}
        ];

    function onError(text) {
        console.error(text);
    }

    function multiply(a, b) {
        var c = [];
        repeat(a.values.length / a.dimension, function(aRowIndex){
            repeat(b.dimension, function(bColumnIndex){
                c[(aRowIndex * b.dimension) + bColumnIndex] = 0;
                repeat(a.dimension, function(aColumnIndex){
                    c[(aRowIndex * b.dimension) + bColumnIndex] += a.values[(aRowIndex * a.dimension) + aColumnIndex] *
                    b.values[(aColumnIndex * b.dimension) + bColumnIndex];
                });
            });
        });
        return c;
    }

    function changeMatrix(matrix) {
        if (matrix.toggle.checked) {
            currentMatrix = matrix;
        }
    }

    function buildRow() {
        return document.createElement("ul");
    }

    function buildCell(id, value, parent) {
        var li = document.createElement("li"),
            input = document.createElement("input");

        input.id = id;
        input.type = "text";
        input.value = value;
        li.appendChild(input);

        if (parent instanceof HTMLUListElement) {
            parent.appendChild(li);
        }

        return li;
    }

    function render() {

        // render matrix
        each(matrixList, renderMatrix);
    }

    function calculate() {

        var a = matrixList[0],
            b = matrixList[1],
            c = [];

        if (a.dimension === (b.values.length / b.dimension)) {
            c = multiply(a, b);
            renderMatrix({
                id: "C",
                el: resultMatrix,
                values: c,
                dimension: b.dimension
            });

        } else {
            onError("Кол-во столбцов первой матрицы не совпадает с кол-во строк второй матрицы");
        }
    }

    function renderMatrix(matrix) {

        var center = matrix.el.children[2],
            row;

        // clear
        center.innerHTML = "";

        // filling matrix
        each(matrix.values, function(value, key){

            if ((key % matrix.dimension) === 0) {
                row = buildRow();
                center.appendChild(row);
            }

            buildCell(matrix.id+"."+key, value, row);
        });

    }

    // prepare matrix
    each(matrixList, function(matrix){

        // get matrix selector
        matrix.toggle = document.querySelector(matrix.toggleSelector);
        // get matrix container
        matrix.el = document.querySelector(matrix.containerSelector);

        // matrix properties
        matrix.dimension = 2;
        matrix.values = [];

        // fill matrix 2x2
        repeat(matrix.dimension * 2, function(){ matrix.values.push(0); });

        bind(matrix.toggle, "change", changeMatrix.bind(this, matrix));
        changeMatrix(matrix);
    });

    bind(multiplyAction, "click", calculate);

    // update model on enter values
    bind(workspace, "change", function(event){
        if (event.target.tagName === "INPUT") {
            var value = event.target.value,
                data = event.target.id.split(".");
            each(matrixList, function(matrix){
                if (matrix.id == data[0]) {
                    matrix.values[parseInt(data[1])] = parseInt(value);
                }
            });
        }
    });

    bind(clearAction, "click", function(){
        each(matrixList, function(matrix){
            matrix.values = collect(matrix.values, function(){ return 0; });
        });
        calculate();
        render();
    });

    bind(exchangeAction, "click", function(){

        var tempValues = matrixList[0].values.slice(0),
            tempDimension = matrixList[0].dimension;

        matrixList[0].values = matrixList[1].values.slice(0);
        matrixList[0].dimension = matrixList[1].dimension;

        matrixList[1].values = tempValues;
        matrixList[1].dimension = tempDimension;

        render();

    });

    bind(addColumnAction, "click", function(){
        if (currentMatrix) {
            repeat(currentMatrix.values.length / currentMatrix.dimension, function(rowIndex){
                currentMatrix.values.splice((rowIndex * 2 + 1) * currentMatrix.dimension, 0, 0);
            });
            currentMatrix.dimension++;
            render();
        }
    });

    bind(addRowAction, "click", function(){
        if (currentMatrix) {
            repeat(currentMatrix.dimension, function(){
                currentMatrix.values.push(0);
            });
            render();
        }
    });

    bind(delColumnAction, "click", function(){
        if (currentMatrix && currentMatrix.dimension > 2) {
            repeat(currentMatrix.values.length / currentMatrix.dimension, function(rowIndex){
                currentMatrix.values.splice((rowIndex + 1) * currentMatrix.dimension - (rowIndex+1), 1);
            });
            currentMatrix.dimension--;
            render();
        }
    });

    bind(delRowAction, "click", function(){
        if (currentMatrix && (currentMatrix.values.length / currentMatrix.dimension) > 2) {
            currentMatrix.values.splice(currentMatrix.values.length - currentMatrix.dimension, currentMatrix.dimension);
            render();
        }
    });

    calculate();
    render();
}());