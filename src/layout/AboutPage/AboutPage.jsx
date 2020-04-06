import React from 'react';
import './AboutPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faTwitter,
  faMedium,
} from '@fortawesome/free-brands-svg-icons';
import { ReactComponent as DataClinicSVG } from '../../icons/dataClinicWhite.svg';
import usePageView from '../../hooks/analytics';

export default function AboutPage() {
  usePageView('/about');

  return (
    <div className="about-page">
      <section className="about-dark-header">
        <div className="about-header-full">
          <h3>Introducing scout</h3>
          <h2>Uncover data from New York State.</h2>
        </div>
        <div className="content">
          <div>
            <p>We built scout to make data more accessible.</p>
          </div>
          <div>
            <p>
              scout is a new way to browse New York&apos;s open data portal. It
              focuses on data discoverability, joinability and creating curated
              collections of datasets that deal with a specific subject.
            </p>
            <p>
              By focusing not on agencies, or departments, scout allows you to
              quickly identify datasets that are related to each other and can
              even potentially be joined together using a common ID. Having
              found these collections of datasets, scout makes it easy to share
              your findings with others through our data collections.
            </p>
          </div>
        </div>
      </section>
      <section className="about-section-two-up">
        <div className="center">
          <img src={`${process.env.PUBLIC_URL}/circles.png`} alt="" />
        </div>
        <div>
          <h3>Lots of datasets are lonely</h3>
          <p>
            While many open data sets are downloaded and viewed daily, there are
            many more that get far less attention. We think there is a lot of
            untapped potential in these datasets, especially when combined with
            some of the better known ones.
          </p>
          <p>
            Our goal is to make sure that when you search for a dataset, you are
            exposed to every other dataset that might also be relevant.
          </p>
        </div>
      </section>
      <section className="about-section-two-up dark">
        <div>
          <h3>What is Data Clinic?</h3>

          <p>
            As the data and tech philanthropic arm of Two Sigma, Data Clinic
            provides pro bono data science and engineering support to nonprofits
            and engages in open source tooling and research that contribute to
            the Data for Good movement.
          </p>
          <p>
            {' '}
            We leverage Two Sigma’s people, data science skills, and
            technological know-how to support communities, mission driven
            organizations, and the broader public in their effort to use data
            more effectively.
          </p>
          <p>
            {' '}
            To learn more visit{' '}
            <a
              href="dataclinic.twosigma.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              dataclinic.twosigma.com
            </a>{' '}
            and connect with us via{' '}
            <a href="mailto:dataclinic@twosigma.com">dataclinic@twosigma.com</a>
            .
          </p>
        </div>
        <div className="center">
          <DataClinicSVG />
        </div>
      </section>

      <section className="about-section-two-up teal">
        <div className="social">
          <ul>
            <li>
              <a
                href="https://github.com/tsdataclinic/scout"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/dataclinic"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FontAwesomeIcon icon={faMedium} />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/tsdataclinic"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3>How can I contribute?</h3>
          <p>
            We want scout to grow to help support the needs of the open data
            community. That means that we need a lot of voices helping us shape
            the features we are developing. If you would like to suggest a
            feature, please either open a ticket on github or reach out to us on
            one of our social media channels.
          </p>
          <p>
            If you are a developer, designer or want to contribute in a
            technical capacity we would love your help! Head over to our github
            page to open issues, suggest features, contribute pull requests and
            find beginner issues.
          </p>
        </div>
      </section>
    </div>
  );
}
