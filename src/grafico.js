import * as d3 from "d3";

class Grafico {
  // quando inizializzo un oggetto
  // prende i parametri già settati se non gli passo niente
  constructor(mountPoint = "body", width = 500, height = 200, padding = 40) {
    //this è il puntatore all'oggetto di tipo Barchart
    this.mountPoint = mountPoint;
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.grafico = d3
      .select(mountPoint)
      .append("svg") // svg è un tag
      .attr("width", width)
      .attr("height", height);
    this.grafico
      .append("g") //g è un gruppo
      .attr("id", "plot-area");
    this.grafico
      .append("g") //g è un gruppo
      .attr("id", "labels");
    this.grafico
      .append("g")
      .attr("id","colonne");
    this.renderYAxis();
  }
  //chain call: ogni metodo segue un'azione e restitusce il suo oggetto (this)
  xScale(data) {
    return d3
      .scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([this.padding, this.width - this.padding])
      .paddingInner(0.05);
  }

  yScale(data) {
    return (
      d3
        .scaleLinear()
        .domain([1, d3.max(data)])
        // il range va dal max al min per far ordinare giusti i valori sull'asse Y
        .range([this.height - this.padding, this.padding])
    );
  }

  renderYAxis() {
    //funzione che crea l'asse in base al dominio e al range
    this.grafico
      .append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(30, 0)")
  }

  updateYAxis(data){
    let y_axis = d3.axisLeft(this.yScale(data));
    this.grafico.selectAll('g.y_axis')
        .transition()
        .duration(1000)
        .call(y_axis);
  }

  renderBars(data) {
    this.updateYAxis(data);

    let bars = this.grafico
      .select("#plot-area")
      .selectAll("rect")
      .data(data);
    console.log("prima", bars);

    bars
      .enter()
      .append("rect")
      //scaleLog
      //.attr('y', (valore, indice) => this.height - this.yScale(data)(valore))
      .attr("x", (valore, indice) => this.xScale(data)(indice))
      .attr("y", this.height - this.padding)
      .attr("width", this.xScale(data).bandwidth())
      .merge(bars)
      .transition()
      .delay((data, indice) => 300 * indice)
      .ease(d3.easeExpOut)
      .duration(2400)
      .attr("fill", "teal")
      .attr("x", (valore, indice) => this.xScale(data)(indice))
      .attr("width", this.xScale(data).bandwidth())
      .attr(
        "height",
        (valore, indice) =>
          this.yScale(data)(d3.max(data) - valore) - this.padding
      )
      .attr(
        "y",
        (valore, indice) =>
          this.height - this.yScale(data)(d3.max(data) - valore)
      )
      .transition()
      .duration(1000)
      .attr("fill", "red");

    console.log("dopo", bars);

    bars
      .exit()
      .transition()
      .duration(500)
      .attr("x", (d, i) => this.width + 40)
      .remove();

    
  }

  renderLabels(data) {
    let etichette = d3
      .select("#labels")
      .selectAll("text")
      .data(data);

    etichette
      .enter()
      .append("text")
      .attr(
        "x",
        (valore, indice) =>
          this.xScale(data)(indice) + this.xScale(data).bandwidth() / 2
      )
      .attr("y", this.height)
      .attr("opacity", 0)
      .merge(etichette)
      .attr(
        "x",
        (valore, indice) =>
          this.xScale(data)(indice) + this.xScale(data).bandwidth() / 2
      )
      .attr('y',0)
      .transition()
      .delay((data, indice) => 300 * indice)
      .duration(2400)
      .attr("opacity", 1)
      .attr("y", (valore, indice) => {
        if (this.yScale(data)(d3.max(data) - valore) > this.height - 60) {
          return this.height - this.yScale(data)(d3.max(data) - valore) + 30;
          return this.yScale(data)(valore) - 30;
        } else {
          //scaleLog
          //return this.height - this.yScale(data)(valore) - 10;
          return this.height - this.yScale(data)(d3.max(data) - valore) - 10;
        }
      })
      .attr("fill", valore => {
        if (this.yScale(data)(d3.max(data) - valore) > this.height - 60) {
          return "#ffffff";
        } else {
          return "teal";
        }
      })
      // centro il label (è un attributo del tag svg)
      .attr("text-anchor", "middle")
      .attr("font-size", 22)
      .attr("rx", 2)
      .attr("ry", 2)
      .text(d => d);

    etichette
      .exit()
      .transition()
      .duration(500)
      .attr("opacity", 0)
      .remove();
  }

  renderLabelsColonne(data) {
    let etichette = d3
      .select("#colonne")
      .selectAll("text")
      .data(data);

    etichette
      .enter()
      .append("text")
      .attr(
        "x",
        (valore, indice) =>
          this.xScale(data)(indice) + this.xScale(data).bandwidth() / 2
      )
      .attr("y", this.height - 60)
      .merge(etichette)
      .attr(
        "x",
        (valore, indice) =>
          this.xScale(data)(indice) + this.xScale(data).bandwidth() / 2
      )
      .attr("fill","#fff")
      // centro il label (è un attributo del tag svg)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .text(d => d);

    etichette
      .exit()
      .transition()
      .duration(500)
      .attr("opacity", 0)
      .remove();
  }
  
  addInteraction() {
    d3.selectAll("rect").on("click", (valore, indice) =>
      console.log(valore, indice, this)
    );
  }

  render(data) {
    this.renderBars( data.map(o=>o.dato) );
    this.renderLabels( data.map(o=>o.dato) );
    this.renderLabelsColonne( data.map(o=>o.nome) );
    //this.addInteraction();
  }
}

// per importare la classe Barchart dagli altri js
// devo fare un export della classe
export default Grafico;
