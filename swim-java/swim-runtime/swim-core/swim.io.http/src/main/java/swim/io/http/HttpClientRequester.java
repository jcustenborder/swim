// Copyright 2015-2023 Swim.inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package swim.io.http;

import java.net.InetSocketAddress;
import java.security.Principal;
import java.security.cert.Certificate;
import java.util.Collection;
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;
import swim.codec.Decoder;
import swim.http.HttpException;
import swim.http.HttpRequest;
import swim.http.HttpResponse;
import swim.io.FlowControl;
import swim.io.FlowModifier;
import swim.io.IpSocket;

public class HttpClientRequester<T> implements HttpRequesterContext {

  protected final HttpClientModem modem;
  protected final HttpRequester<T> requester;
  volatile HttpRequest<?> request;
  volatile int status;

  public HttpClientRequester(HttpClientModem modem, HttpRequester<T> requester) {
    this.modem = modem;
    this.requester = requester;
    this.request = null;
    this.status = 0;
  }

  @Override
  public boolean isConnected() {
    return this.modem.isConnected();
  }

  @Override
  public boolean isClient() {
    return this.modem.isClient();
  }

  @Override
  public boolean isServer() {
    return this.modem.isServer();
  }

  @Override
  public boolean isSecure() {
    return this.modem.isSecure();
  }

  @Override
  public String securityProtocol() {
    return this.modem.securityProtocol();
  }

  @Override
  public String cipherSuite() {
    return this.modem.cipherSuite();
  }

  @Override
  public InetSocketAddress localAddress() {
    return this.modem.localAddress();
  }

  @Override
  public Principal localPrincipal() {
    return this.modem.localPrincipal();
  }

  @Override
  public Collection<Certificate> localCertificates() {
    return this.modem.localCertificates();
  }

  @Override
  public InetSocketAddress remoteAddress() {
    return this.modem.remoteAddress();
  }

  @Override
  public Principal remotePrincipal() {
    return this.modem.remotePrincipal();
  }

  @Override
  public Collection<Certificate> remoteCertificates() {
    return this.modem.remoteCertificates();
  }

  @Override
  public FlowControl flowControl() {
    return this.modem.flowControl();
  }

  @Override
  public void flowControl(FlowControl flowControl) {
    this.modem.flowControl(flowControl);
  }

  @Override
  public FlowControl flowControl(FlowModifier flowModifier) {
    return this.modem.flowControl(flowModifier);
  }

  @Override
  public HttpSettings httpSettings() {
    return this.modem.httpSettings();
  }

  @Override
  public void writeRequest(HttpRequest<?> request) {
    this.request = request;
    do {
      final int oldStatus = HttpClientRequester.STATUS.get(this);
      if ((oldStatus & HttpClientRequester.REQUESTED) == 0) {
        final int newStatus = oldStatus | HttpClientRequester.REQUESTED;
        if (HttpClientRequester.STATUS.compareAndSet(this, oldStatus, newStatus)) {
          if ((newStatus & HttpClientRequester.REQUESTING) != 0) {
            this.modem.doWriteRequest(request);
          }
          break;
        }
      } else {
        throw new HttpException("already requested");
      }
    } while (true);
  }

  @SuppressWarnings("unchecked")
  void willRespond(HttpResponse<?> response) {
    this.requester.willRespond(response);
    final Decoder<?> contentDecoder = this.requester.contentDecoder(response);
    this.modem.doReadResponsePayload((Decoder<HttpResponse<?>>) response.payloadDecoder(contentDecoder));
  }

  @SuppressWarnings("unchecked")
  void didRespond(HttpResponse<?> response) {
    this.requester.didRespond((HttpResponse<T>) response);
  }

  @Override
  public void become(IpSocket socket) {
    this.modem.become(socket);
  }

  @Override
  public void close() {
    this.modem.close();
  }

  void doRequest() {
    this.requester.doRequest();
    do {
      final int oldStatus = HttpClientRequester.STATUS.get(this);
      if ((oldStatus & HttpClientRequester.REQUESTING) == 0) {
        final int newStatus = oldStatus | HttpClientRequester.REQUESTING;
        if (HttpClientRequester.STATUS.compareAndSet(this, oldStatus, newStatus)) {
          if ((newStatus & HttpClientRequester.REQUESTED) != 0) {
            this.modem.doWriteRequest(this.request);
          }
          break;
        }
      } else {
        throw new AssertionError();
      }
    } while (true);
  }

  void willRequest(HttpRequest<?> request) {
    this.requester.willRequest(request);
  }

  void didRequest(HttpRequest<?> request) {
    this.requester.didRequest(request);
  }

  void willBecome(IpSocket socket) {
    this.requester.willBecome(socket);
  }

  void didBecome(IpSocket socket) {
    this.requester.didBecome(socket);
  }

  void didDisconnect() {
    this.requester.didDisconnect();
  }

  void didTimeout() {
    this.requester.didTimeout();
  }

  void didFail(Throwable error) {
    this.requester.didFail(error);
  }

  static final int REQUESTING = 1 << 0;
  static final int REQUESTED = 1 << 1;

  @SuppressWarnings("unchecked")
  static final AtomicIntegerFieldUpdater<HttpClientRequester<?>> STATUS =
      AtomicIntegerFieldUpdater.newUpdater((Class<HttpClientRequester<?>>) (Class<?>) HttpClientRequester.class, "status");

}
