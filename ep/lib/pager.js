/*
	@optoins
	itemPerPage		:한페이지당 글갯수
	pageCount		:하단 네비게이션 갯수
*/
var Pager = function(options) {
    this.options = options;
};

/*
@param
nowPage		: 현제페이지
totalCount	: 총글갯수

@returns
startNav	: 네비게이션시작 페이지 번호
endNav		: 네비게이션끝 페이지 번호
isPrev		: 네비게이션 이전 있는지유무
isNext		: 네비게이션 다음 있는지유무
*/
Pager.prototype.getBottomNav = function(nowPage, totalCount) {
    var retObj = {}; //리턴객체
    var options = this.options;

    //시작페이지계산
    retObj.startNav = (Math.floor((nowPage - 1) / options.pageCount)) * options.pageCount + 1;

    //끝페이지계산
    retObj.endNav = retObj.startNav + options.pageCount - 1;
    retObj.nowPage = nowPage;

    //뷰 글스타트 번호
    retObj.startViewNum = totalCount - ((nowPage - 1) * options.itemPerPage);


    //글이 네비게이션셋일경우
    if (retObj.startNav == 1) {
        retObj.isPrev = false;
    } else {
        retObj.prevNum = ((nowPage - 1) / options.pageCount) * options.pageCount - options.pageCount + 1;
        retObj.isPrev = true;
    }
    //네비게이션 마지막이 글전체페이지수를 초과할경우
    if (retObj.endNav >= this.getTotalPage(totalCount)) {
        retObj.endNav = this.getTotalPage(totalCount);
        retObj.isNext = false;
    } else {

        retObj.isNext = true;
    }

    retObj.totalPage = this.getTotalPage(totalCount);

    return retObj;

};

/*

*/
Pager.prototype.getTotalPage = function(totalCount) {
    var options = this.options;
    return Math.ceil(totalCount / options.itemPerPage);
};

Pager.prototype.getSkip = function(page) {
    var options = this.options;
    return (page - 1) * options.itemPerPage;
};



angular.module('app.paging', [])
    .directive("paging", function($compile) {
        return {
            restrict: "EA",
            scope: {
                paging: "=paging",
                click: "&click"
            },
            template: "<div class=\"pagination pagination-small pagination-centered\">" +
             "<ul class=\"pagination\">" +
             "<li ng-class=\"{'disabled' : !paging.isPrev, '' : paging.isPrev  }\">" +
             "<a ng-click=\"clicklistner(1, paging.isPrev)\" >«</a>" +
             "</li>" +
             "<li ng-class=\"{'disabled' : !paging.isPrev, '' : paging.isPrev  }\">" +
             "<a ng-click=\"clicklistner(paging.startNav, paging.isPrev)\" }}\">&lt;</a>" +
             "</li>" +
             "<li ng-repeat=\"n in [paging.startNav, paging.endNav] | makeRange\" ng-class=\"{'active':n==paging.nowPage }\">" +
             "<a ng-click=\"clicklistner(n, n!=paging.nowPage)\">{{n}}</a>" +
             "</li>" +
             "<li ng-class=\"{'disabled' : !paging.isNext, '' : paging.isNext  }\">" +
             "<a ng-click=\"clicklistner(paging.endNav, paging.isNext)\">&gt;</a>" +
             "</li>" +
             "<li ng-class=\"{'disabled' : !paging.isNext, '' : paging.isNext  }\">" +
             "<a  ng-click=\"clicklistner(paging.totalPage, paging.isNext)\">»</a>" +
             "</li>" +
             "</ul>" +
             "</div>",
            link: function(scope, element, attrs) {

                scope.clicklistner = function(n, flag) {
                    if (flag) {
                        scope.paging.nowPage = n;
                        scope.click({
                            n: n
                        });
                    }
                };




            }
        };
    })
/**
 * 배열을 원하는 횟수만큼 반복하기
 *
 *  <div class="row-fluid" ng-repeat="n in 10| makeRange">
 *  <div class="row-fluid" ng-repeat="n in [0, 9]| makeRange">
 *
 *  Output
 *     n = 0 ~ 9 반복
 */
.filter("makeRange", function() {
    //<div class="margin0 span12 " ng-repeat="n in [1,2]| makeRange">
    return function(input) {
        var lowBound, highBound;
        switch (input.length) {
        case 1:
            lowBound = 0;
            highBound = parseInt(input[0]) - 1;
            break;
        case 2:
            lowBound = parseInt(input[0]);
            highBound = parseInt(input[1]);
            break;
        default:
            return input;
        }
        var result = [];
        for (var i = lowBound; i <= highBound; i++)
            result.push(i);
        return result;
    };
});

/*

	


*/
