angular.module('app', [])

.controller('appCtrl', function($scope, ObtenerSaldo,$http)
{

	$scope.producto ={};
	$scope.alert = "";
	$scope.addToCart = function(producto){
		if (producto.cantidad == null) {

			Materialize.toast('Debe Ingresar Cantidad a Comprar', 3000);

		}else{

			var a = producto.cantidad * producto.precio;
			$scope.items.push({"nombre":producto.nombre,"cantidad":producto.cantidad,"precio":producto.precio,"sum":a});
			console.log($scope.items);
			Materialize.toast('Articulo Agregado con Exito', 3000);
		}	
	};

	$scope.delete = function(index){
		$scope.items.splice(index, 1);
    }

	$scope.items = [];

	$scope.getTotal = function(){
    var total = 0;
    for(var i = 0; i < $scope.items.length; i++){
        var product = $scope.items[i];
        //total += (product.precio * product.cantidad);
        total += (product.sum);
        $scope.venta = total;
    }
    return total;
	}

	$scope.totalItems = function(){
    var total = 0;
    total = $scope.items.length;
    return total;
    }

    $scope.generarCompra = function(){
    	//Materialize.toast('aqui va la funcion que envia la compra al portal de pago', 3000);
    	//$http.post("https://www.sandbox.paypal.com/cgi-bin/webscr",)
    	$http.post('https://www.sandbox.paypal.com/cgi-bin/webscr',req)
		.success(function(data){
			console.log(data);
			Materialize.toast('Generando proceso de compra', 3000);

		})
		.error(function(err){
			console.log(err);
			Materialize.toast('Error: '+err, 3000);
		});
	
    	var req = {
		url: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','Access-Control-Allow-Origin':'*'},
		data: { 
				cmd:"_xclick",
			    business:"luis-facilitador@luisvilches.cl",
			    item_name:"Productos chilito",
			    currency_code:"USD",
			    amount: 200,
			    return:"http://localhost:8080",
				cancel_return:"http://localhost:8080"
			 }
		}
/*		$http.post(req).then(function(data){
			
		}, function(err){
			console.log(err);
			Materialize.toast('Error: '+err, 3000);
		});

*/
    }

	
	ObtenerSaldo.get().then(function(data)
	{
		$scope.productos = data.data.points;
		console.log(data.data.points);
	},
	function(err)
	{
		$scope.error = err.statusText;
		console.log(err);
	})
})

.factory('ObtenerSaldo', function($http)
{
	return {
		get: function()
		{
			return $http({
				url: 'http://chilito.herokuapp.com/api/v1/all',
				method: 'GET',
				headers: {'Accept': 'application/json;'}
			})
		}
	}
})
