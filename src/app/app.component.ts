import { Component, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef, Renderer2, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';
import { DialogDetailsComponent } from './dialog/dialog.component';
import { app } from 'electron';
import * as fs from 'fs';
declare var MathJax: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'gd-app';
  // content: string;
  inputContent = '';
  jsonTree = { name: '', children: [] };

  svg = null;
  viewBoxStartX = 0;
  viewBoxStartY = 0;
  viewBoxEndX = 1000;
  viewBoxEndY = 10000;
  scaleSpeed = 200;
  moveSpeed = 50;
  lastClientX = 0;
  lastClientY = -1;
  forbidCopy = false;
  useBrowser = false;

  svgConfig: SvgConfig;
  @ViewChild('inputfile', { static: true }) inputfile: ElementRef;
  @ViewChild('svgContent', { static: true }) svgContent: ElementRef;

  constructor(public dialog: MatDialog, private renderer: Renderer2, private el: ElementRef) {
    // svgWidth: number, svgHeight: number, tabIndex: number, lineColor: string, textColor: string
    this.svgConfig = new SvgConfig(1000, 1000, 2, '#0781FF', 'black');
  }
  relaodFile() {
    this.read();
  }
  ngOnInit(): void {
    this.useBrowser = JSON.parse(localStorage.getItem('useBrowser'));
    if (this.useBrowser) {
      this.forbidCopy = true;
    } else {
      this.forbidCopy = false;
    }
  }
  changeUseBrowser() {
    localStorage.setItem('useBrowser', JSON.stringify(this.useBrowser));
    if (this.useBrowser) {
      if (this.svg) {
        this.forbidCopy = true;
        this.svg.attr('width', this.svgConfig.svgWidth);
        this.svg.attr('height', this.svgConfig.svgHeight);
        this.svg.attr('viewBox', '0 0 ' + this.svgConfig.svgWidth + ' ' + this.svgConfig.svgHeight);
      }
    } else {
      if (this.svg) {
        this.forbidCopy = false;
        this.resetSvg();
      }
    }
  }
  read() {
    // 本地文件写入
    const filePath = JSON.parse(localStorage.getItem('path'));
    if (!filePath) {
      return console.log('no file');
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      } else {
        this.inputContent = data;
        this.convertAndDraw();
      }
    });

    // fs.writeFile(filePath, 'electron + Javascript', (err) => {
    //   if (!err) {
    //     console.log('写入成功！');
    //   }
    // });

  }
  ngAfterViewInit() {
    this.read();
    window.onresize = ((event) => {
      if (this.svg && !this.useBrowser) {
        this.svg.attr('width', this.svgContent.nativeElement.offsetWidth);
        this.svg.attr('height', this.svgContent.nativeElement.offsetHeight);
      }
    });
  }
  uploadFileClick() {
    this.inputfile.nativeElement.click();
  }
  /*
  * 读取文件内容
  */
  processFiles(file: any): void {
    file = file.target.files[0];
    if (file) {
      console.log(file.path);
      localStorage.setItem('path', JSON.stringify(file.path));
      console.log('只支持UTF-8');
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = ((event: any) => {
        this.inputContent = event.target.result;
        this.convertAndDraw();
      });
      reader.onerror = ((event) => {
        console.log(event);
      });
    }
  }
  /*
  * 转换并绘制
  */
  convertAndDraw(): void {
    this.convertText();
    this.drawSvg();
  }
  /*
  * 将文本内容转换为易于使用的json
  */
  convertText(): void {
    if (!this.inputContent) {
      return;
    }
    this.jsonTree = { name: '', children: [] };
    const contentArrary = this.inputContent.split('###');
    // 解析配置
    this.compileConfig(contentArrary[0].split('\n'));
    const stringArrary = contentArrary[1].split('\n');
    if (stringArrary[0] === '') {
      stringArrary.splice(0, 1);
    }
    for (let s of stringArrary) {
      if (!s) {
        continue;
      }
      let i = 0;
      for (; i < s.length; i = i + this.svgConfig.tabIndex) {
        if (s.charAt(i) !== ' ') {
          break;
        }
      }
      s = s.substring(i, s.length);
      if (s.charAt(0) === '#') {// 如果是注释就不做处理
        continue;
      }
      s = s.replace('  ', '\n');
      let jsonchildren = this.jsonTree;
      if (s.charAt(0) === '@') {
        for (; ;) {
          if (jsonchildren.children.length > 0) {
            jsonchildren = jsonchildren.children[jsonchildren.children.length - 1];
          } else {
            jsonchildren.name = jsonchildren.name + '\n' + s.substring(1, s.length);
            break;
          }
        }
      } else {
        const spaceIndex = i / this.svgConfig.tabIndex;  // 表示缩进
        for (let j = 0; j < spaceIndex; j++) {
          if (jsonchildren.children.length > 0) {
            jsonchildren = jsonchildren.children[jsonchildren.children.length - 1];
          } else {
            break;
          }
        }
        jsonchildren.children.push({ name: s, children: [] });
      }
    }
    this.jsonTree = this.jsonTree.children[0];
  }


  /*
  * 获取svg配置
  */
  compileConfig(stringConfigs: string[]) {
    stringConfigs = stringConfigs.filter((item) => {
      return item.charAt(0) !== '#';
    });
    for (const config of stringConfigs) {
      if (config.indexOf('svg-height') >= 0) {
        this.svgConfig.svgHeight = parseFloat(config.split(':')[1]);
      } else if (config.indexOf('svg-width') >= 0) {
        this.svgConfig.svgWidth = parseFloat(config.split(':')[1]);
      } else if (config.indexOf('tab-index') >= 0) {
        this.svgConfig.tabIndex = parseFloat(config.split(':')[1]);
      } else if (config.indexOf('line-color') >= 0) {
        this.svgConfig.lineColor = config.split(':')[1];
      } else if (config.indexOf('text-color') >= 0) {
        this.svgConfig.textColor = config.split(':')[1];
      }
    }
    this.viewBoxEndY = this.svgConfig.svgHeight;
    this.viewBoxEndX = this.svgConfig.svgWidth;
  }
  drawSvg() {
    const content = d3.select('#content');
    // 定义边界
    const marge = { top: 50, bottom: 0, left: 10, right: 0 };

    this.svg = d3.select('svg');
    if (this.svg.attr('width') > 0) {
      d3.select('svg').remove();
      this.svg = content.append('svg');
    }
    this.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.svgConfig.svgWidth)
      .attr('height', this.svgConfig.svgHeight)
      .attr('fill', 'white');
    this.svg.attr('fill', 'white');
    if (this.useBrowser) {
      this.svg.attr('width', this.svgConfig.svgWidth);
      this.svg.attr('height', this.svgConfig.svgHeight);
    } else {
      this.svg.attr('width', this.svgContent.nativeElement.offsetWidth);
      this.svg.attr('height', this.svgContent.nativeElement.offsetHeight);
    }
    const g = this.svg.append('g')
      .attr('transform', 'translate(' + marge.top + ',' + marge.left + ')');
    // 创建一个hierarchy layout
    const hierarchyData = d3.hierarchy(this.jsonTree)
      .sum((d) => {
        return d.value;
      });
    // 创建一个树状图
    const tree = d3.tree()
      .size([this.svgConfig.svgHeight - 200, this.svgConfig.svgWidth - 400])
      // 节点距离
      .separation((a, b) => {
        return (a.parent === b.parent ? 1 : 2) / a.depth;
      });
    // 初始化树状图，也就是传入数据,并得到绘制树基本数据
    const treeData = tree(hierarchyData);
    // 得到节点
    const nodes = treeData.descendants();
    const links = treeData.links();
    // 创建一个贝塞尔生成曲线生成器
    const bézierCurveGenerator: any = d3.linkHorizontal()
      .x((d) => {
        return d.y;
      })
      .y((d) => {
        return d.x;
      });

    // 有了节点和边集的数据后，我们就可以开始绘制了，
    // 绘制边
    g.append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', (d) => {
        const start = { x: d.source.x + 1, y: d.source.y };
        const end = { x: d.target.x + 1, y: d.target.y };
        return bézierCurveGenerator({ source: start, target: end });
      })
      .attr('fill', 'none')
      .attr('stroke', '#0781FF')
      .attr('stroke-width', 1);

    // 绘制节点和文字
    // 老规矩，先创建用以绘制每个节点和对应文字的分组<g>
    const gs = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d) => {
        const cx = d.x;
        // d.data.name
        const cy = d.y;
        return 'translate(' + cy + ',' + cx + ')';
      });
    // 绘制节点
    gs.append('circle')
      .attr('r', 4)
      .attr('fill', 'white')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1);

    // 文字
    gs.append('text')
      .attr('x', (d) => {
        return d.children ? -40 : 8;
      })
      .attr('y', -5)
      .attr('dy', 10)
      .attr('fill', 'black')
      .text((d) => {
        return d.data.name;
      });
    this.wrapWord(gs.selectAll('text'));
    this.svg.attr('viewBox', '0 0 ' + this.viewBoxEndX + ' ' + this.viewBoxEndY);
    this.svg.attr('fill', 'white');
  }
  resetSvg() {
    if (this.useBrowser) {
      return;
    }
    this.viewBoxEndY = this.svgConfig.svgHeight;
    this.viewBoxEndX = this.svgConfig.svgWidth;
    this.lastClientX = -1;
    this.lastClientY = -1;
    this.svg.attr('width', this.svgContent.nativeElement.offsetWidth);
    this.svg.attr('height', this.svgContent.nativeElement.offsetHeight);
    this.svg.attr('viewBox', '0 0 ' + this.viewBoxEndX + ' ' + this.viewBoxEndY);
  }
  wrapWord(texts: any) {
    const vm = this;
    // tslint:disable-next-line: space-before-function-paren
    texts.each(function () {
      const text = d3.select(this);

      const words = text.text().split('\n');
      let tspan = text.text(null);
      if (words.length > 1) {
        text.attr('class', 'text-node');
        text.on('click', (event) => {
          vm.openDialog(event.data.name);
        });
      }
      const lineHigth = -5;
      tspan = text.append('tspan').attr('x', 10).attr('y', lineHigth).text(words[0]);
    });
  }
  openDialog(content: string): void {
    const dialogRef = this.dialog.open(DialogDetailsComponent, {
      // width: '250px',
      // height: '80%',
      data: content,
      autoFocus: false,
      restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  mouseWheelUp(event: any) {// 放大
    if (!this.svg) {
      return;
    }
    if (this.viewBoxEndX - this.scaleSpeed > 100) {
      this.viewBoxEndX = this.viewBoxEndX - this.scaleSpeed;
    }
    if (this.viewBoxEndY - this.scaleSpeed > 100) {
      this.viewBoxEndY = this.viewBoxEndY - this.scaleSpeed;
    }
    this.svg.attr('viewBox', this.viewBoxStartX + ' ' + this.viewBoxStartY + ' ' + this.viewBoxEndX + ' ' + this.viewBoxEndY);
  }
  mouseWheelDown(event: any) {// 缩小
    if (!this.svg) {
      return;
    }
    this.viewBoxEndX = this.viewBoxEndX + this.scaleSpeed;
    this.viewBoxEndY = this.viewBoxEndY + this.scaleSpeed;
    this.svg.attr('viewBox', this.viewBoxStartX + ' ' + this.viewBoxStartY + ' ' + this.viewBoxEndX + ' ' + this.viewBoxEndY);
  }
  mouseMove(event: any): void {
    // 计算鼠标移动速度
    if (!this.svg) {
      return;
    }
    if (this.lastClientY === -1) {// Y 不可能为-1
      this.lastClientX = event.clientX;
      this.lastClientY = event.clientY;
      return;
    }
    const x = this.lastClientX - event.clientX;
    if (x > 0) {// left
      this.viewBoxStartX = this.viewBoxStartX + this.moveSpeed;
    } else if (x < 0) {// right
      this.viewBoxStartX = this.viewBoxStartX - this.moveSpeed;
    }
    const y = this.lastClientY - event.clientY;
    if (y > 0) {// up
      this.viewBoxStartY = this.viewBoxStartY + this.moveSpeed;
    } else if (y < 0) {// down
      this.viewBoxStartY = this.viewBoxStartY - this.moveSpeed;
    }
    this.svg.attr('viewBox', this.viewBoxStartX + ' ' + this.viewBoxStartY + ' ' + this.viewBoxEndX + ' ' + this.viewBoxEndY);
    this.lastClientX = event.clientX;
    this.lastClientY = event.clientY;
  }
  mouseMoveEnd(event: any): void {
    this.lastClientX = -1;
    this.lastClientY = -1;
  }
  saveSvg(): void {
    this.resetSvg();
    const html = d3.select('svg')
      .attr('title', 'math')
      .attr('version', 1.1)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      // .attr('viewBox', '0 0 ' + this.viewBoxEndX + ' ' + this.viewBoxEndY)
      .node().parentNode.innerHTML;
    const blob = new Blob([html], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'math.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
