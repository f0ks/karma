const parentComponent = {
    controller: function () {
        const ctrl = this;
        ctrl.api = {
            someKey: 123
        };
        ctrl.someMethod = function (event) {
            ctrl.api = event.message;
        };
    },
    template: `
    	<div>
        <h1>Parent API: {{ $ctrl.api.someKey }}</h1>
        <child 
          api="$ctrl.api"
          on-update="$ctrl.someMethod($event);">
        </child>
      </div>
    `
};

const childComponent = {
    bindings: {
        api: '<',
        onUpdate: '&'
    },
    template: `
  	<div>
      Child component
      <input ng-model="$ctrl.api.someKey">
      <button ng-click="$ctrl.doSomething();">
        Click me
      </button>
    </div>
  `,
    controller: function () {
        const ctrl = this;
        ctrl.$onChanges = function (changes) {
            if (changes.api) {
                ctrl.api = angular.copy(ctrl.api);
            }
        };
        ctrl.doSomething = function () {
            ctrl.onUpdate({
                $event: {
                    message: ctrl.api
                }
            });
        };
    }
};

angular.module('demoApp', [])
  .component('parent', parentComponent)
  .component('child', childComponent);
