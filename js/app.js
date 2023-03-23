var app = angular.module('SBrouteApp',[]);

app.controller('SBrouteController', ['$scope', function($scope) {
	$scope.name = 'Afvalroutes';

	$scope.sortfield = "id";
	
	$scope.table = [];
	
	app.setTableData = function(data , refresh){
		$scope.table = data;
		$scope.$apply();
	}
	
	$scope.selectRemove = function(idx) {
		select.getFeatures().removeAt(idx);
		$scope.table = [];
		var feats =  select.getFeatures().getArray()
		for (var i = 0; i < feats.length; i++) {
			var feat = feats[i];
			$scope.table.push({'idx': i, 'id': feat.get('WS_OIDN'), 'name': feat.get('LSTRNM') })
		}
	}
	
	$scope.removeAll = function() {
		select.getFeatures().clear(); 
		$scope.table = [];
	}
	
}]);

