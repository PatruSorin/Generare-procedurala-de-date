// l-system generator

"use strict";
  var reguli = { f: "ff+f+f+f+ff" };
  var axioma = "f+f+f+f";
  var ungi = 90;
function ff(){

  var reguli = JSON.parse(prompt("Reguli"));
  // var reguli = JSON.parse(reguli1);;
  var axioma = prompt("Axioma");
  var ungi = prompt("Ungi");

  LSystem.presets = [
      new LSystem({ x: "f-[[x]+x]+f[+fx]-x", f: "ff" }, "x", 25, "plant 01", 6),
      new LSystem({ x: "f[+x]f[-x]+x", f: "ff" }, "x", 360 / 18, "plant 02", 6),
      new LSystem({ x: "f", f: "ff-[-f+f+f]+[+f-f-f]" }, "x", -20, "plant 03", 5),
      new LSystem({ f: "fff-[f-f+f+f]+[f+f-f-f]" }, "f", 15, "plant 04", 4),
      new LSystem({ f: "f[+f]f[-f]f" }, "f", 25.7, "plant 05",5),
      new LSystem({ x: "f[+x][-x]fx", f: "ff" }, "x", 25.7, "plant 06",7),
      new LSystem({ f: "f+f-f-f+f" }, "f", 90, "koch curve"),
      new LSystem({ x: "yf+xf+y", y: "xf-yf-x" }, "x", 60, "sierpinski triunghi", 8),
      new LSystem({ f: "f+f-f-f-g+f+f+f-f", g: "ggg" }, "f", 90, "sierpinski carpet"),
      new LSystem({ x: "x+yf", y: "fx-y" }, "fx", 90, "dragon curve", 9),
      new LSystem({ f: "f-f++f+f-f-f" }, "f-f-f-f-f", 360 / 5, "pentigree"),
      new LSystem({ x: "-yf+xfx+fy-", y: "+xf-yfy-fx+" }, "x", 90, "hilbert", 6),
      new LSystem({ x: "fx+fx+fxfy-fy-", y: "+fx+fxfy-fy-fy", f: "" }, "fx", 90, "cross", 5),
      new LSystem({ x: "x+yf++yf-fx--fxfx-yf+", y: "-fx+yfyf++yf+fx--fx-y" }, "x", 60, "peano-gosper"),
      new LSystem({ f: "ff+f+f+f+ff" }, "f+f+f+f", 90, "box"),
      new LSystem( reguli, axioma, ungi, "custom")
  ];

   loadPreset(0);

}



var LSystem = (function () {
    function LSystem(reguli, axioma, unghi, nume, iteratii) {
        this.reguli = reguli;
        this.axioma = axioma;
        this.unghi = unghi;
        this.nume = nume;
        this.iteratii = iteratii || 4;
    }

    LSystem.prototype.generate = function (iteratii) {
        var i, p;
        var prod = this.axioma;
        var newProd = "";

        for (i = 0; i < iteratii; i++) {
            newProd = "";
            for (p = 0; p < prod.length; p++) {
                if (this.reguli[prod[p]] === undefined) {
                    newProd += prod[p];
                } else {
                    newProd += this.reguli[prod[p]];
                }
            }
            prod = newProd;
        }

        return prod;
    };

    LSystem.prototype.compute = function (iteratii) {
        var prod = this.generate(iteratii);
        var a = 0;
        var i;
        var aStep = this.unghi * Math.PI / 180;
        var p = { x: 0, y: 0 };
        this.maxX = this.minX = this.maxY = this.minY = 0;
        this.paths = [];
        var path = [];
        var stack = [];

        for (i = 0; i < prod.length; i++) {
            path.push({ x: p.x, y: p.y });
            switch (prod[i]) {
                case "[":
                    stack.push({ x: p.x, y: p.y, a: a });
                    break;
                case "]":
                    this.paths.push(path);
                    path = [];
                    var top = stack.pop();
                    p.x = top.x;
                    p.y = top.y;
                    a = top.a;
                    break;
                case "-":
                    a -= aStep;
                    break;
                case "+":
                    a += aStep;
                    break;
                case "f":
                    p.x += Math.cos(a);
                    p.y += Math.sin(a);
                    this.maxX = Math.max(p.x, this.maxX);
                    this.minX = Math.min(p.x, this.minX);
                    this.maxY = Math.max(p.y, this.maxY);
                    this.minY = Math.min(p.y, this.minY);
                    break;
            }
        }
        if (path.length > 0) {
            this.paths.push(path);
        }
    };

    LSystem.prototype.draw = function (canvas, iteratii) {
        var i, p;
        this.compute(iteratii);

        // have to manually re-set canvas dimensions from css values
        var ctx = canvas.getContext("2d");
        var scale = window.devicePixelRatio;
        ctx.canvas.width = $(canvas).width() * scale;
        ctx.canvas.height = $(canvas).height() * scale;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        var xRatio = canvas.width / (this.maxX - this.minX);
        var yRatio = canvas.height / (this.maxY - this.minY);
        ctx.translate(-this.minX * xRatio, -this.minY * yRatio);

        for (p = 0; p < this.paths.length; p++) {
            ctx.beginPath();
            var path = this.paths[p];
            ctx.moveTo(path[0].x * xRatio, path[0].y * yRatio);
            for (i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].x * xRatio, path[i].y * yRatio);
            }
            ctx.stroke();
        }
    };
    LSystem.presets = [
        new LSystem({ x: "f-[[x]+x]+f[+fx]-x", f: "ff" }, "x", 25, "plant 01", 6),
        new LSystem({ x: "f[+x]f[-x]+x", f: "ff" }, "x", 360 / 18, "plant 02", 6),
        new LSystem({ x: "f", f: "ff-[-f+f+f]+[+f-f-f]" }, "x", -20, "plant 03", 5),
        new LSystem({ f: "fff-[f-f+f+f]+[f+f-f-f]" }, "f", 15, "plant 04", 4),
        new LSystem({ f: "f[+f]f[-f]f" }, "f", 25.7, "plant 05",5),
        new LSystem({ x: "f[+x][-x]fx", f: "ff" }, "x", 25.7, "plant 06",7),
        new LSystem({ f: "f+f-f-f+f" }, "f", 90, "koch curve"),
        new LSystem({ x: "yf+xf+y", y: "xf-yf-x" }, "x", 60, "sierpinski triunghi", 8),
        new LSystem({ f: "f+f-f-f-g+f+f+f-f", g: "ggg" }, "f", 90, "sierpinski carpet"),
        new LSystem({ x: "x+yf", y: "fx-y" }, "fx", 90, "dragon curve", 9),
        new LSystem({ f: "f-f++f+f-f-f" }, "f-f-f-f-f", 360 / 5, "pentigree"),
        new LSystem({ x: "-yf+xfx+fy-", y: "+xf-yfy-fx+" }, "x", 90, "hilbert", 6),
        new LSystem({ x: "fx+fx+fxfy-fy-", y: "+fx+fxfy-fy-fy", f: "" }, "fx", 90, "cross", 5),
        new LSystem({ x: "x+yf++yf-fx--fxfx-yf+", y: "-fx+yfyf++yf+fx--fx-y" }, "x", 60, "peano-gosper"),
        new LSystem({ f: "ff+f+f+f+ff" }, "f+f+f+f", 90, "box"),
        new LSystem( reguli, axioma, ungi, "costom")
    ];

    return LSystem;
})();


((function ($) {
    var _this = this;
    var canvas;
    var form;

    function render() {
        var reguli = {};
        var ruleTxt = $("#rules").val().trim().split("\n");
        $.each(ruleTxt, function (i, v) {
            var kv = v.split(/\s*->\s*/);
            reguli[kv[0]] = kv[1];
        });
        var axioma = $("#seed").val().trim();
        var unghi = parseInt($("#angle").val(), 10);
        var iteratii = parseInt($("#iterations").val(), 10);
        var ls = new LSystem(reguli, axioma, unghi, "no name", iteratii);
        if (iteratii >= 1) {
            ls.draw(canvas, iteratii);
        }
    }

    function loadPreset(p) {
        var preset = LSystem.presets[p];
        var reguli = [];
        $.each(preset.reguli, function (k, v) {
            reguli.push(k + " -> " + v);
        });
        $("#rules").val(reguli.join("\n"));
        $("#seed").val(preset.axioma);
        $("#angle").val(preset.unghi);
        $("#angle-value").val(preset.unghi);
        $("#iterations").val(preset.iteratii);
        $("#iterations-value").text(preset.iteratii);
        render();
    }

    $.fn.lsysControl = function (c) {
        canvas = c;
        form = $(_this);
        $(_this).submit(function (e) {
            e.preventDefault();
            render();
        });

        $.each(LSystem.presets, function (i, p) {
            var o = $("<option></option>");
            o.append(p.nume);
            o.attr('value', i);
            $("#preset").append(o);
        });

        $("#preset").change(function () {
            loadPreset($(this).val());
        });

        $("#iterations").change(function () {
            var newv = $("#iterations").val();
            $("#iterations-value").text(newv);
            render();
        });

        $("#angle").change(function () {
            var newv = $("#angle").val();
            $("#angle-value").text(newv);
            render();
        });

        loadPreset(0);
        return _this;
    };
})(jQuery));

$(document).ready(function () {
    $(window).resize(function () {
        var canvas = $("canvas");
        var parent = canvas.parent();
        canvas.width(parent.width());
        canvas.height(parent.height());
        $("#lsystem").lsysControl(canvas.get(0));
    });
    $(window).resize();
});
