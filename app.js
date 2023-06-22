// import data from './db.json' assert {type: 'json'}

var app = angular.module("myApp", ["ngRoute", "ngSanitize"]);

app.filter("unsafe", function ($sce) {
  return $sce.trustAsHtml;
});

// var app = angular.module("app", ['ngRoute'])
// Bước1: import angular-route
// Bước2: Khai báo router
// Bước3: Khai báo <ng-view></ng-view>

// Router
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/", {
      templateUrl: "./pages/home.html",
      controller: "myController",
    })
    .when("/product/:id", {
      templateUrl: "./pages/detail.html",
      controller: "productController",
    })

    .when("/admin", {
      templateUrl: "./pages/dashboard.html",
      controller: "dashboardController",
    })
    .when("/updatesp/:id", {
      templateUrl: "./pages/updatesp.html",
      controller: "updatespController",
    })
    .when("/addsp", {
      templateUrl: "./pages/addsp.html",
      controller: "addspController",
    })
    .when("/giohang", {
      templateUrl: "./pages/giohang.html",
      controller: "giohangController",
    })
    .otherwise({
      redirectTo: "/",
    });
});
//giohang
app.controller("giohangController", function ($scope, $routeParams, $http) {
  $scope.id = $routeParams.id;

  $http.get("http://localhost:3000/giohang").then(function (res) {
    $scope.listGioHang = res.data;

  });

  $scope.deleteGHSP = function (id) {
    $http
      .delete("http://localhost:3000/giohang/" + id)
      .then(function (response) {
        if (response.status === 200) {
          alert("Deleted");
        }
      });
  };
  $scope.thanhToan = function () {
    $http.get("http://localhost:3000/giohang").then(function (res) {
      $scope.listGioHang = res.data;

    });
    for (let i = 0; i < $scope.listGioHang.length; i++) {
      $http.delete("http://localhost:3000/giohang/" + $scope.listGioHang[i].id);
      if (i == $scope.listGioHang.length - 1) {
        alert("Thanks you! For bought at my website");
        $location.url("/");
      }
    };
  };

});

app.controller("productController", function ($scope,$rootScope, $routeParams, $http) {
  $scope.id = $routeParams.id;

  $http.get("http://localhost:3000/books/" + $scope.id).then(function (res) {
    $scope.product = res.data;
    $scope.AnhLon = $scope.product.images[0]
  });
// đổi ảnh 
  $scope.Anh = function (thayanh) {
    $scope.AnhLon = $scope.product.images[thayanh];
  }
  // thêm vào giỏ hàng
  $scope.themGioHang = function (laySP) {
    $scope.tensp = laySP.name;
    $scope.giasp = laySP.original_price;
    $scope.soluongsp = $scope.quantity;
    $scope.anhsp = laySP.images[0];
    $scope.tiensp = $scope.giasp * $scope.soluongsp;
    console.log($scope.tensp)
    $http.get("http://localhost:3000/giohang")
      .then(function (res) {
        $scope.listGioHang = res.data;
        for (var i = 0; i < $scope.listGioHang.length; i++) {
         
          if ($scope.listGioHang[i].tensp == laySP.name) {
            $scope.check=1;
            $http.put("http://localhost:3000/giohang/" + $scope.listGioHang[i].id, {
              tensp: $scope.tensp,
              giasp: $scope.giasp,
              anhsp: $scope.anhsp,
              soluongsp: $scope.soluongsp+$scope.listGioHang[i].soluongsp,
              tien1sanpham: ($scope.soluongsp+$scope.listGioHang[i].soluongsp)*$scope.giasp

            })
              .then(function () {
                alert("Thêm sản phẩm thành công");
              })

          }
        }
        //thêm khi không trùng
        if($scope.check==undefined){
          $http.post("http://localhost:3000/giohang",{
            tensp: $scope.tensp,
            giasp: $scope.giasp,
            anhsp: $scope.anhsp,
            soluongsp: $scope.soluongsp,
            tien1sanpham: $scope.tiensp
          })
            .then(function () {
              alert("Thêm sản phẩm thành công");
            })
        }
      })
  }
  
});

app.controller("dashboardController", function ($scope, $http) {
  // $scope.books = $rootScope.books
  $http.get("http://localhost:3000/books/" + $scope.id).then(function (res) {
    $scope.books = res.data;
  });

  $scope.delete = function (id) {
    $http.delete("http://localhost:3000/books/" + id).then(function () {
      alert("Xoá thành công");
    });
  };
});

app.controller("addspController", function ($scope, $http, $location) {
  $scope.them = function (event) {
    if ($scope.product) {
      $scope.product.rating_average = 0;
      $scope.product.images = [$scope.product.images];
      $scope.product.images[0]= $scope.images1
      // $scope.product.images[1] = $scope.images2

      var imgchuoi = $scope.images1.split(",");
      var len = imgchuoi.length;
      // console.log(imgchuoi);
      // console.log("hyehe"+len);
      if (imgchuoi.length == 2) {
        $scope.product.images[0] = imgchuoi[0];
        $scope.product.images[1] = imgchuoi[1];
      }
      else if (imgchuoi.length == 3) {
        $scope.product.images[0] = imgchuoi[0];
        $scope.product.images[1] = imgchuoi[1];
        $scope.product.images[2] = imgchuoi[2];
      }
      else if (imgchuoi.length == 4) {
        $scope.product.images[0] = imgchuoi[0];
        $scope.product.images[1] = imgchuoi[1];
        $scope.product.images[2] = imgchuoi[2];
        $scope.product.images[3] = imgchuoi[3];
      }


      $http
        .post("http://localhost:3000/books", $scope.product)
        .then(function () {
          $location.url("/admin");
          alert("Thêm mới thành công");
        });
    }
  };
  $scope.huy = function () {
    $location.url("/admin");
  };
});
app.controller(
  "updatespController",
  function ($scope, $routeParams, $http, $location) {
    $scope.id = $routeParams.id;
    $http.get("http://localhost:3000/books/" + $scope.id).then(function (res) {
      $scope.product = res.data;
    });
    $scope.sua = function () {
      
      $http
        .put("http://localhost:3000/books/" + $scope.id, $scope.product)
        .then(function () {
          $location.url("/admin");
          alert("Sửa sản phẩm thành công");
        });
    };
    $scope.huysua = function () {
      $location.url("/admin");
    };
  }
);
app.controller("myController", function ($rootScope, $scope, $http) {
  $rootScope.books = [];
  $http.get("http://localhost:3000/books").then(function (res) {
    $rootScope.books = res.data;
  });

  
  $scope.renderRating = function (star) {
    let index = 0;
    if (star == 0) index = -1;
    if (star > 0) index = 0;

    $scope.rating = "";
    for (index; index < parseInt(star); index++) {
      if (star == 0) {
        return ($scope.rating = `
                             <i class="fas fa-star" style="color: #d1d1d1;"></i>&nbsp;
                             <i class="fas fa-star" style="color: #d1d1d1;"></i>&nbsp;
                             <i class="fas fa-star" style="color: #d1d1d1;"></i>&nbsp;
                             <i class="fas fa-star" style="color: #d1d1d1;"></i>&nbsp;
                             <i class="fas fa-star" style="color: #d1d1d1;"></i>
                             `);
      }

      $scope.rating += `<i class="fas fa-star"></i>&nbsp;`;
    }
    return $scope.rating;
  };
  $scope.quantity = 1;
  $scope.down = function () {
    $scope.quantity--;
    if ($scope.quantity < 0) {
      $scope.quantity = 0;
    }
  };
  $scope.up = function () {
    $scope.quantity++;
  };

  // get all Pro
  $scope.getAll = function () {
    $http.get("http://localhost:3000/books").then(function (res) {
      $rootScope.books = res.data;
    });
  };
  // bán chạy
  $scope.banChay = function () {
    var list = [];
    $http.get("http://localhost:3000/books")
      .then(function (res) {
        $rootScope.data = res.data;
      })
    for (var i = 0; i < $rootScope.data.length; i++) {
      if ($rootScope.data[i].rating_average != 0) list.push($rootScope.data[i]);
    }

    $rootScope.books = list;
  };

  // tìm kiếm sản phẩm

  $scope.timKiem = function (ten) {
    let list = [];
    $http.get("http://localhost:3000/books")
    .then(function(res){
      $rootScope.data = res.data;
    })
    for (let i = 0; i < $rootScope.data.length; i++) {
      let sp = $rootScope.data[i].name.toLowerCase();

      if (sp.includes(ten.toLowerCase())) {
        list.push($rootScope.data[i]);
      }
    }
    $rootScope.books = list;
    console.log(list);
  };

  // sản phẩm mới
  $scope.newPro = function () {
    var list = [];
    $http.get("http://localhost:3000/books")
      .then(function (res) {
        $rootScope.data = res.data;
      })
    for (var i = 0; i < $rootScope.data.length; i++) {
      if ($rootScope.data[i].rating_average == 0) list.push($rootScope.data[i]);
    }

    $rootScope.books = list;
  };

  // lọc giá từ thấp -> cao
  $scope.giaTangDan = function () {
    $http.get("http://localhost:3000/books").then(function (res) {
      $rootScope.books = res.data;
      $rootScope.books.sort(function (a, b) {
        return a.original_price - b.original_price;
      });
    });
  };
  // lọc giá từ cao -> thấp
  $scope.giaGiamDan = function () {
    $http.get("http://localhost:3000/books").then(function (res) {
      $rootScope.books = res.data;
      $rootScope.books.sort(function (a, b) {
        return b.original_price - a.original_price;
      });
    });
  };

});



