app.rootVM = {
    userInfo:ko.observable(),
    isLoggedIn: ko.observable(),

    mainVm:(function(){
        var vm = {
            Title: 'Manage your documents <br />Simply & Easy',//ko.observable('Manage your documents <br />Simply & Easy')
            Text: 'The simple, intuitive app that makes it easy<br />to create documents, manage documents <br />and work balances faster.'
        };
        return vm;
    })(),

    documentsVm:(function(){                
        var vm = {            
            documents: ko.observableArray(getDocuments())
        };
        //console.log("------------", vm.documents);
        vm.initTpl = function() {
            $('#myTable').DataTable({
                responsive: true
            });
        };
        vm.delete = function(doc) {
            //console.log("delete:", doc);
            vm.documents.remove(doc);
            deleteDocument(doc);
        };
        vm.add = function(doc){
            vm.documents.push(doc);
            addDocument(doc);
        };
        vm.edit = function(doc){
            var match = ko.utils.arrayFirst(vm.documents(), function(d) {
                return d.Id == doc.Id;
            }); 
            //console.log("---match:", doc, match);          
            if(match != null){
                vm.delete(match);
                vm.add(doc);
            }
        };
        vm.getdoc = function(id){
            var match = ko.utils.arrayFirst(vm.documents(), function(d) {
                return d.Id == id;
            }); 
            //console.log("---match:", doc, match);          
            if(match != null){
                return match;
            } 
            return null;
        };  
        return vm;
    })(),

    newDocumentVm:(function(){        
        var vm = {
            docId: -1,
            document
        };
        vm.activate = function(activationParams){
            if(typeof activationParams != 'undefined' && typeof activationParams.id != 'undefined'){
                vm.docId = activationParams.id;
                let d = app.rootVM.documentsVm.getdoc(vm.docId);
                if(d != null){
                    vm.document.Id = d.Id;
                    vm.document.Name = d.Name;
                    vm.document.TotalAmount = d.TotalAmount;
                }
            }
        };
        vm.reset = function(){
            vm.document = ko.observable(new Document()).extend({
                validation: {
                    validator: function (val) {
                        return val > 0;
                    },
                    message: 'The amount must be > 0',
                    params: vm.document.TotalAmount
                }
            });
            // vm.document.Name.extend({required: true});
            // vm.document.TotalAmount.extend({required: true});
        };
        vm.action = function(){
            if(vm.docId > -1){
                app.rootVM.documentsVm.edit({'Id':vm.document.Id, 'Name':vm.document.Name,'TotalAmount':vm.document.TotalAmount});                
            }
            else{
                app.rootVM.documentsVm.add({'Id':Date.now(),'Name':vm.document.Name,'TotalAmount':vm.document.TotalAmount});
            }
            vm.reset();
            window.location = '#documents';
        }; 
        vm.reset();     
        return vm;
    })(),

    examplesVm: (function(){
        var vm = {
            someText:ko.observable(),
        };

        vm.activate = function(activationParams){
            app.log("Main was activated");
            vm.someText(activationParams.message);
        };

        vm.reactivate = function(){
            app.log("Main was activated again.");
        };

        vm.deactivate = function(){
            app.log("Main was deactiveted");
        };

        vm.canDeactivate = function(canDeactivateParam){
            canDeactivateParam.confirmDeactivate();
        };

        vm.clicked = function(){
            app.log("MainVM you clicked me.")
            location.hash = "document/new/" + vm.someText();
        };

        vm.openPopup = function(){
            app.log("openPopup was clicked.")
            app.rootVM.infoDialogVM.openInfo("This is what you wrote: " + vm.someText());
        };

        vm.showLoading = function(){
            app.log("showLoading was clicked.")
            app.rootVM.infoDialogVM.startLoading("Loading for 5 sec");
            setTimeout(function(){
                app.rootVM.infoDialogVM.stopLoading("Loading for 5 sec");
            }, 5000);
        };

        return vm;
    })(),
    
    infoDialogVM: (function () {
        var loadingCount = ko.observable(0);
        var loadingParams = ko.observableArray([]);
        var currInfo = ko.observable(undefined);
        var shouldBeClosedByBackButton = ko.observable(false);
        var lastLoadingText = undefined;
        var onClose = undefined;
        var startLoadingDeley = 1500;

        var res = {
            isDefaultCloseButtonEnabled: ko.observable(true),
            isTitleCloseButtonEnabled: ko.observable(true),
            isOpen: ko.observable(false),
            type: ko.observable("info"),
            content: ko.observable("test"),
            title: ko.observable(undefined),
            commands: ko.observableArray(),

            loadingText: ko.computed(function () {
                var params = loadingParams();
                var info = ko.unwrap(currInfo);

                return (info !== undefined) ? info.text : lastLoadingText;
            }),
            isLoading: ko.computed(function () {
                return ko.unwrap(currInfo) !== undefined;
            }),
            startLoading: function (text, isAsync) {

                if (isAsync === undefined) {
                    isAsync = false;
                }

                if (!text) {
                    text = localize("loading");
                }
                
                var loadingObject = {
                    text: text,
                };

                if (startLoadingDeley > 0 && isAsync) {
                    loadingObject.show = false;
                    var handler = setTimeout(function () {

                        loadingObject.handler = undefined;
                        currInfo(loadingObject);
                    }, startLoadingDeley);

                    loadingObject.handler = handler;
                }
                else {
                    currInfo(loadingObject);
                }

                loadingParams.push(loadingObject);
            },
            closeDialog: function () {
                this.isOpen(false);
            },
            stopLoading: function (text) {
                var removedObject = undefined;
                var params = loadingParams();

                if (params.length) {

                    lastLoadingText = params[0].text;

                    if (!text) {
                        removedObject = loadingParams.pop();
                    }
                    else {
                        var foundItem = undefined;

                        for (var i = 0; i < params.length; i++) {
                            if (params[i].text == text) {
                                foundItem = params[i];
                                break;
                            }
                        }

                        if (foundItem) {
                            removedObject = foundItem;
                            loadingParams.remove(foundItem);
                        }
                        else {
                            removedObject = loadingParams.pop();
                        }
                    }

                    if (removedObject && removedObject.handler) {
                        clearTimeout(removedObject.handler);
                        removedObject.handler = undefined;
                    }

                    currInfo(params[params.length - 1]);
                }
                else {
                    currInfo(undefined);
                }
            },
            stopAllLoading: function () {
                if (loadingParams().length) {
                    var params = loadingParams();
                    for (var i = 0; i < params.length; i++) {
                        if (params[i].handler) {
                            clearTimeout(params[i].handler);
                            params[i].handler = undefined;
                        }
                    }
                    lastLoadingText = loadingParams()[0].text;
                }                
                loadingParams([]);
                currInfo(undefined);
            },
            confirm: function (text, title) {
                var that = this;
                var p = ServiceHelper.newPromise();
                this.openInfo(text, title, [{ text: localize("ok"), autoClose: true, action: function () { p.resolve(); } }, { isDanger: true, text: localize("main:cancel"), autoClose: true, action: function () { p.reject(); } }], undefined, false, false)
                return p;
            },
            open: function (content, title, commands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled) {
                this.isOpen(true);
                this.content(content);
                this.title(title);

                _.forEach(commands, function (c) {
                    if (!_.has(c, 'autoClose'))
                        c.autoClose = true;
                });

                this.commands(commands);

                if (isDefaultCloseButtonEnabled === false) {
                    this.isDefaultCloseButtonEnabled(false);
                }
                else {
                    this.isDefaultCloseButtonEnabled(true);
                }

                this.isTitleCloseButtonEnabled(isTitleCloseButtonEnabled);
            },           
            openType: function (type, content, title, commands, onCloseFunction, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled) {

                var args = {
                    type: type,
                    content: content,
                    title: title,
                    commands: commands,
                    onCloseFunction: onCloseFunction,
                    isDefaultCloseButtonEnabled: isDefaultCloseButtonEnabled,
                    isTitleCloseButtonEnabled: isTitleCloseButtonEnabled
                };

                // This will allow to have overload when we get 1 params object or all the parameters.
                if (arguments.length === 1 && typeof(type) === "object") {
                    args = type;
                }

                onClose = args.onCloseFunction;
                this.type(args.type);

                if (args.isTitleCloseButtonEnabled == undefined) {
                    args.isTitleCloseButtonEnabled = true;
                }

                this.open(args.content, args.title, args.commands, args.isDefaultCloseButtonEnabled, args.isTitleCloseButtonEnabled);
            },

            openSync: function (content, title, commands, onCloseFunction, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled, type) {
                onClose = onCloseFunction;
                var p = ServiceHelper.newPromise();

                var rejectCommand = { isDanger: true, text: localize("main:cancel"), autoClose: true, action: function () { p.reject(); } };

                var promiseCommands = _.map(commands, function (c) {
                    if (!_.has(c, 'action'))
                        c.action = function () {
                            p.resolve(c.action);
                        };
                    return c;
                });
                if (isDefaultCloseButtonEnabled) {
                    promiseCommands = _.isArray(promiseCommands) ? promiseCommands.concat(rejectCommand) : [rejectCommand];
                }
                if (type === 'info')
                    this.openInfo(content, title, promiseCommands, onClose, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled);
                else if (type === 'error')
                    this.openError(content, title, promiseCommands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled, onClose);
                else
                    this.open(content, title, promiseCommands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled);
                return p;
            },

            openInfoSync: function (content, title, commands, onCloseFunction, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled) {
                return this.openSync(content, title, commands, onCloseFunction, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled, 'info');
            },
            openInfo: function (content, title, commands, onCloseFunction, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled) {
                onClose = onCloseFunction;
                this.type("info");
                this.open(content, title, commands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled);
            },
            openErrorSync: function (content, title, commands, onCloseFunction, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled) {
                return this.openSync(content, title, commands, onCloseFunction, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled, 'error');
            },
            openError: function (content, title, commands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled, onCloseFunction) {
                onClose = onCloseFunction;
                this.type("error");
                this.open(content, title, commands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled);
            },
            openInfoWithOkDialog: function (content, title, commands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled) {
                if (commands === undefined)
                    commands = [];
                commands.push({
                    text: localize('ok'),
                    action: function () { }
                }
                );
                this.openInfo(content, title, commands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled);
            },
            openErrorWithOkDialog: function (content, title, commands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled) {
                if (commands === undefined)
                    commands = [];
                commands.push({
                    text: localize('ok'),
                    action: function () { }
                }
                );
                this.openError(content, title, commands, isDefaultCloseButtonEnabled, isTitleCloseButtonEnabled);
            },
        };

        res.isOpen.subscribe(function (isOpened) {

            // Call On Close
            if (isOpened === false && onClose) {
                onClose();
                onClose = undefined;
            }
        });

        return res;
    })(),
    
    moduleDeactivated: function () { },
    moduleActivated: function () { }
};