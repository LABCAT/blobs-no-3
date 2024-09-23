import blobshape from "blobshape";

export default class AnimatedBlob {

    constructor(p, x, y) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.speed = 6;
        this.size = p.width / 8;
        this.growth = parseInt(p.random(3, 9));
        this.edges = parseInt(p.random(16, 32));
        this.seed =  p.random(1, 100);
        this.fillHue = p.random(0, 360);
        this.strokeHue = p.random(0, 360);
        const { path } = blobshape({ size: this.size, growth: this.growth, edges: this.edges, seed: this.seed });
        this.pathArray = this.parseSVGPath(path);
    }

    
    parseSVGPath = (pathData) => {
        let commands = pathData.match(/[a-df-z][^a-df-z]*/gi);
        let pathArray = [];
        
        for (let cmd of commands) {
            let command = cmd.charAt(0);
            let params = cmd.slice(1).split(/[\s,]+/).map(Number);
            pathArray.push([command, ...params]);
        }
        
        return pathArray;
    }

    update () {
        this.size = this.size + this.speed;
        const { path } = blobshape({ size: this.size, growth: this.growth, edges: this.edges, seed: this.seed });
        this.pathArray = this.parseSVGPath(path);
    }

    draw () {
        const translateX = this.x - (this.size / 2);
        const translateY = this.y - (this.size / 2);
        
        this.p.push();
        this.p.translate(translateX, translateY);
        this.p.fill(
            this.fillHue,
            100,
            100,
            0.33
        );
        this.p.stroke(
            this.strokeHue,
            100,
            100,
            0.66
        );
        this.p.beginShape();
        for (let cmd of this.pathArray) {
            let command = cmd[0];
            let params = cmd.slice(1);
            
            if (command === 'M') {
                this.p.vertex(params[0], params[1]);
            } else if (command === 'Q') {
                this.p.quadraticVertex(params[0], params[1], params[2], params[3]);
            }
        }
        this.p.endShape(this.p.CLOSE);
        this.p.translate(-translateX, -translateY);
        this.p.pop();
    }
}