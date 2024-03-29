import React from "react";
import axios from "axios";

export default class FileUpload extends React.Component {
  state = {
    loading: false,
    url: "",
  };

  handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    this.setState({ loading: true });

    const payload = await fetch(`/api/v1/upload/direct_post`).then((res) =>
      res.json()
    );

    const url = payload.url;
    const formData = new FormData();

    Object.keys(payload.fields).forEach((key) =>
      formData.append(key, payload.fields[key])
    );
    formData.append("file", file);

    const xml = await fetch(url, {
      method: "POST",
      body: formData,
    }).then((res) => res.text());

    // axios.post(url, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Accept': 'multipart/form-data',
    //     },
    // }).then(res=>{
    //   console.log(res)
    // }).catch(err=>{
    //   console.log(err)
    // })

    // let result = await fetch(signedUrl, {
    //   method: 'PUT',
    //   body: formData
    // }).then(res=>{
    //     console.log("Response")
    //     console.log(res)
    //   }).catch(err=>{
    //     console.log("err")
    //     console.log(err)
    //   })

    const uploadUrl = new DOMParser()
      .parseFromString(xml, "application/xml")
      .getElementsByTagName("Location")[0].textContent;

    this.setState({
      loading: false,
      url: uploadUrl,
    });
  };

  render() {
    return (
      <div>
        <div id="image-box">
          {this.state.url ? (
            <img
              src={this.state.url}
              alt=""
              style={{ width: "200px", height: "200px" }}
            />
          ) : (
            <h4>Select Image</h4>
          )}
          {this.state.loading ? <h4>Loading ...</h4> : null}
        </div>
        <input
          type="file"
          hidden
          ref={(el) => (this.img = el)}
          onChange={this.handleUpload}
        />
        <button onClick={() => this.img.click()}>Choose File</button>
      </div>
    );
  }
}
