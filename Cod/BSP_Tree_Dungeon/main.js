var map

function debug(stuff) {
    $('#debug ul li.active').removeClass('active')
    $('#debug ul').prepend("<li class='active'>"+stuff+"</li>")
}

var initMap = function() {
    try {
        SQUARE = 400 / MAP_SIZE
        Math.seedrandom(SEED)
        var c = document.getElementById('viewport').getContext('2d')
        var time = new Date()
        map = new Map(400, 400, c)
        map.paint()
        var exectime = new Date().getTime() - time.getTime()
        debug("Harta generata in " + exectime +" ms")
    } catch (exception) {
        debug(exception)
        c.fillStyle = "#000"
        c.fillRect(0,0,400,400)
    }
}

;(function() {

    if (window.location.hash !== "") {
        SEED = window.location.hash.substring(1)
    }

    $('#seed').val(SEED)

    // This is far too lazy :D

    var connections = [
        {
            'name': 'mapsize',
            'variable': 'MAP_SIZE',
            'type': 'int'
        },
        {
            'name': 'iterations',
            'variable': 'N_ITERATIONS',
            'type': 'int'
        },
        {
            'name': 'h_ratio',
            'variable': 'H_RATIO',
            'type': 'float'
        },
        {
            'name': 'w_ratio',
            'variable': 'W_RATIO',
            'type': 'float'
        },
        {
            'name': 'd_grid',
            'variable': 'D_GRID',
            'type': 'boolean',
            'context': 'draw'
        },
        {
            'name': 'd_bsp',
            'variable': 'D_BSP',
            'type': 'boolean',
            'context': 'draw'
        },
        {
            'name': 'd_rooms',
            'variable': 'D_ROOMS',
            'type': 'boolean',
            'context': 'draw'
        },
        {
            'name': 'd_paths',
            'variable': 'D_PATHS',
            'type': 'boolean',
            'context': 'draw'
        },
        {
            'name': 'discard_ratio',
            'variable': 'DISCARD_BY_RATIO',
            'type': 'boolean'
        }
    ]

    for (var i = 0; i < connections.length; i++) {
        var connection = connections[i]
        var input = $('input[name='+connection.name+']')
        switch(connection.type) {
            case 'boolean':
                input.prop('checked', eval(connection.variable))
                break
            default:
                input.val(eval(connection.variable))
        }
        $('input[name='+connection.name+']').change(function(event) {
            switch(this.type) {
                case 'boolean':
                    window[this.variable] = $(event.target).prop('checked')
                    break
                case 'int':
                    window[this.variable] = parseInt(event.target.value)
                    break
                case 'float':
                    window[this.variable] = parseFloat(event.target.value)
                default:
                    window[this.variable] = event.target.value
            }

            if (event.target.name == 'discard_ratio') {
                var ratio_inputs = $('input[name=w_ratio],input[name=h_ratio]')
                ratio_inputs.prop('disabled',!$(event.target).prop('checked'))
            }

            if (this.context !== undefined && this.context == 'draw')
                map.paint()
            else
                initMap()

        }.bind(connection))
    }

    $('#discard_label_footnote').click(function(event) {
        event.preventDefault()
        debug("elimina partitii cu w/h sau h/w mai mic decat cea definita.\
               Daca o partitie nu corespunde ea este eliminata si regenerata\
               pana cand indeplineste conditiile de dimensiune minima")
    })
    initMap()

    $('#generate').click(function(event) {
        event.preventDefault()
        SEED = CryptoJS.MD5("" + new Date().getTime()).toString()
        $('#seed').val(SEED)
        initMap()
    })
    $('#load').click(function(event) {
        event.preventDefault()
        SEED = $('#seed').val()
        initMap()
    })
}())
