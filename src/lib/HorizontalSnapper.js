var snapTime = 30;
export default function HorizontalSnapper(element){
    this.snapping = false;
    this.snappingTime = 0;
    this.element = element;
    this.stopSnapping = false;
    this.from = 0;
    this.isTouchDown = false;

    function snap(){
        console.log("snap!");
        if(this.snapping){
            //Already snapping
            if(this.stopSnapping){
                //Something asked us to stop snapping, must obey
                this.snappingTime = 0;
                this.snapping = false;
                this.stopSnapping = false;
            }else{
                //Continue snapping :D
                this.snappingTime++;
                let progress = this.snappingTime/snapTime;
                let bounds = this.element.getBoundingClientRect();
                let to = Math.round(this.element.scrollLeft/bounds.width)*bounds.width;
                let diff = to - this.from;
                let target = this.from + diff*(-Math.cos(progress*Math.PI)+1)/2;
                this.element.scrollLeft = Math.round(target);
                if(this.snappingTime >= snapTime){
                    //Finished snapping, tell ourselves to stop!
                    this.stopSnapping = true;
                }
                //Done for now...
                window.requestAnimationFrame(snap.bind(this));
            }
        }else{
            //Not yet snapping, start
            this.snapping = true;
            this.from = this.element.scrollLeft;
            window.requestAnimationFrame(snap.bind(this));
        }
    }

    function onScroll(event){
        if(!this.isTouchDown){
            if(this.timer){
                clearInterval(this.timer);
            }
            this.timer = window.setTimeout(snap.bind(this), 100);
        }
    }

    function onTouch(event){
        this.isTouchDown = true;
        if(this.timer){
            clearInterval(this.timer);
        }
        if(this.snapping){
            this.stopSnapping = true;
        }
    }

    function onTouchStop(event){
        this.isTouchDown = false;
        this.timer = window.setTimeout(snap.bind(this), 100);
    }

    console.log("Binding listeners");

    this.element.addEventListener('scroll', onScroll.bind(this));
    this.element.addEventListener('touchstart', onTouch.bind(this));
    this.element.addEventListener('touchend', onTouchStop.bind(this));

    console.log("Bound!");
}