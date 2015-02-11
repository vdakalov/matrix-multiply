(function(){
    'use strict';

    var workspace = query(".workspace"),
        multiplyAction = query("#action-multiply"),
        addRowAction = query("#action-add-row"),
        delRowAction = query("#action-del-row"),
        addColumnAction = query("#action-add-column"),
        delColumnAction = query("#action-del-column"),
        clearAction = query("#action-clear"),
        exchangeAction = query("#action-exchange"),
        message = query("#message"),
        toolbar = query(".toolbar"),

        defaultValue = null,
        currentMatrix,
        resultMatrix = query("#result-matrix"),
        matrixList = [
            {id: "A", toggleSelector: "#toggle-matrixA", containerSelector: "#matrixA", canMod: true},
            {id: "B", toggleSelector: "#toggle-matrixB", containerSelector: "#matrixB", canMod: true}
        ];

    function hideError() {
        removeClass(toolbar, "error");
        message.innerHTML = "";
    }

    function showError(text) {
        removeClass(toolbar, "error");
        removeClass(toolbar, "mod");
        addClass(toolbar, "error");
        message.innerHTML = text;
    }

    function hideMod() {
        removeClass(toolbar, "mod");
        message.innerHTML = "";
    }

    function showMod(text) {
        removeClass(toolbar, "error");
        removeClass(toolbar, "mod");
        addClass(toolbar, "mod");
        message.innerHTML = text;
    }

    function multiply(a, b) {
        var c = [];
        repeat(a.values.length / a.dimension, function(aRowIndex){
            repeat(b.dimension, function(bColumnIndex){
                c[(aRowIndex * b.dimension) + bColumnIndex] = defaultValue;
                repeat(a.dimension, function(aColumnIndex){
                    if (c[(aRowIndex * b.dimension) + bColumnIndex] === defaultValue &&
                      a.values[(aRowIndex * a.dimension) + aColumnIndex] !== defaultValue &&
                      b.values[(aColumnIndex * b.dimension) + bColumnIndex] !== defaultValue) {
                        c[(aRowIndex * b.dimension) + bColumnIndex] = 0;
                    }
                    if (c[(aRowIndex * b.dimension) + bColumnIndex] !== defaultValue) {
                        c[(aRowIndex * b.dimension) + bColumnIndex] += a.values[(aRowIndex * a.dimension) + aColumnIndex] *
                            b.values[(aColumnIndex * b.dimension) + bColumnIndex];
                    }
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

    function buildCell(matrix, id, value, parent) {
        var li = document.createElement("li"),
            input = document.createElement("input");

        input.id = matrix.id + "." + id;
        input.type = "text";
        input.value = value === defaultValue ? "" : value;
        input.disabled = !matrix.canMod;
        input.placeholder = matrix.id.toLowerCase() + Math.floor((id / matrix.dimension)+1) +
                ((id % matrix.dimension) + 1);
        li.appendChild(input);

        bind(input, "blur", hideMod);
        bind(input, "focus", function(){
            showMod("");
        });

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
                dimension: b.dimension,
                canMod: false
            });

            hideError();

        } else {
            showError("Кол-во столбцов первой матрицы не совпадает с кол-вом строк второй матрицы");
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

            buildCell(matrix, key, value, row);
        });

    }

    // prepare matrix
    each(matrixList, function(matrix){

        // get matrix selector
        matrix.toggle = query(matrix.toggleSelector);
        // get matrix container
        matrix.el = query(matrix.containerSelector);

        // matrix properties
        matrix.dimension = 2;
        matrix.values = [];

        // fill matrix 2x2
        repeat(matrix.dimension * 2, function(){ matrix.values.push(defaultValue); });

        bind(matrix.toggle, "change", changeMatrix.bind(this, matrix));
        changeMatrix(matrix);
    });

    bind(multiplyAction, "click", function(){
        unFocus(multiplyAction);
        calculate();
    });

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
        unFocus(clearAction);
        each(matrixList, function(matrix){
            matrix.values = collect(matrix.values, function(){ return defaultValue; });
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
        unFocus(exchangeAction);

    });

    bind(addColumnAction, "click", function(){
        unFocus(addColumnAction);
        if (currentMatrix && 10 > currentMatrix.dimension) {
            repeat(currentMatrix.values.length / currentMatrix.dimension, function(rowIndex){
                currentMatrix.values.splice((rowIndex * 2 + 1) * currentMatrix.dimension, 0, defaultValue);
            });
            currentMatrix.dimension++;

            calculate();
            render();
        }
    });

    bind(addRowAction, "click", function(){
        unFocus(addRowAction);
        if (currentMatrix && 10 > (currentMatrix.values.length / currentMatrix.dimension)) {
            repeat(currentMatrix.dimension, function(){
                currentMatrix.values.push(defaultValue);
            });
            calculate();
            render();
        }
    });

    bind(delColumnAction, "click", function(){
        unFocus(delColumnAction);
        if (currentMatrix && currentMatrix.dimension > 2) {
            repeat(currentMatrix.values.length / currentMatrix.dimension, function(rowIndex){
                currentMatrix.values.splice((rowIndex + 1) * currentMatrix.dimension - (rowIndex+1), 1);
            });
            currentMatrix.dimension--;
            calculate();
            render();
        }
    });

    bind(delRowAction, "click", function(){
        unFocus(delRowAction);
        if (currentMatrix && (currentMatrix.values.length / currentMatrix.dimension) > 2) {
            currentMatrix.values.splice(currentMatrix.values.length - currentMatrix.dimension, currentMatrix.dimension);
            calculate();
            render();
        }
    });

    calculate();
    render();
}());