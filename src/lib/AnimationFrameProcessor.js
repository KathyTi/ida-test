let globalId = 0;
let animationFrameId = null;
let processCallbacksDict = new Map();

function processorCallbacks(){

    for(const callback of processCallbacksDict.values()){
        callback();
    }

    processCallbacksDict.clear();
    animationFrameId = null;
}

export default class AnimationFrameProcessor{

    static request(callback){

        if(animationFrameId === null){
            animationFrameId = requestAnimationFrame(processorCallbacks);
        }

        const id = globalId++;

        processCallbacksDict.set(id, callback);

       return id;
    }

    static cancel(id){
        processCallbacksDict.delete(id);
    }
}
