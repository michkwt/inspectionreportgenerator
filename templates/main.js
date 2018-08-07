Vue.component('signature-pad', {
  template: '#signaturepad',
  props: ['item'],
  delimiters: ['${', '}'],
  data () {
    return {
      signaturePad: null,
      dataUrl: null
    }
  },
  mounted () {
    this.signaturePad = new SignaturePad(this.$refs.canv, {
      onEnd: () => {
        this.dataUrl = this.signaturePad.toDataURL()
        // as example collect all url in parent
        this.$emit('update', this.dataUrl)
      },
      backgroundColor: 'rgb(255, 255, 255)'
    })
  }
})

new Vue({
  el: '#app',
  delimiters: ['${', '}'],
  data: {
    signaturesNeeded: 1,
    html: '',
    pdf: '', // pdf.cool
    ppdf: '', // Prince PDF
    // all signature urls as example
    signatureDataUris: []
  },
  methods: {
    async submitForm (x) {
      const result = await fetch('/htmlgen', { method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-CSRF-Token': x.target.elements['gorilla.csrf.Token'].value },
        body: new FormData(x.target) })
        .then((result) => { return result.json() })
      this.html = result.HTML

      const pdf = await fetch(`/pdfgen?url=${result.HTML}`)
        .then((result) => { return result.json() })
      console.log(pdf)
      this.pdf = pdf.PDF

      const ppdf = await fetch(`/pdfgen?svc=raptor&url=${result.HTML}`)
        .then((result) => { return result.json() })
      this.ppdf = ppdf.PDF
    },
    updateSignature (index, url) {
      Vue.set(this.signatureDataUris, index, url)
      console.log(this.signatureDataUris)
    }
  }
})
